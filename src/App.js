import React, {
  useEffect,
  useContext,
  useReducer,
  useCallback,
  useMemo,
  useRef,
  useImperativeHandle,
  useLayoutEffect,
  useDebugValue,
  useState,
  forwardRef
} from 'react';
// import logo from './logo.svg';
import './App.css';

//default example
/*
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}
*/

// constant
const defaultCount = 0
const defaultString = 'tui la tran thanh tai'
const actionType = {
  INCREMENT: 'increment',
  DECREMENT: 'decrement',
  RESET: 'reset'
}

//test useReducer
const initialState = { 
  count: 0,
  widgets: [{ price: 15 }, { price: 20 }]
}
const testReducer = (state, action) => {
  switch (action.type) {
    case actionType.INCREMENT:
      return { ...initialState, count: state.count + 1 };
    case actionType.DECREMENT:
      return { ...initialState, count: state.count - 1 };
    default:
      throw new Error();
  }
}

const CounterWithReducer = () => {
  // const initialCount = 12
  const [{ widgets, count }, dispatch] = useReducer(testReducer, initialState);
  // const [state, dispatch] = useReducer(testReducer, { count: initialCount })

  //test useMemo
  /**
   * 
    lưu lại kết quả của hàm nào và những giá trị nào sẽ làm thay đổi kết quả đó.
    chỉ định widgets nếu không thay đổi thì đừng đi tính lại totalPrice
   */
  const widgetList = useMemo(
    () =>
      widgets.map(w => ({
        ...w,
        totalPrice: 10 * parseInt(w.price),
      })),
    [widgets]
  )
  console.log('widgetList', widgetList)

  return (
    <div>
      Count: {count}
      <button onClick={() => dispatch({type: actionType.DECREMENT})}>-</button>
      <button onClick={() => dispatch({type: actionType.INCREMENT})}>+</button>
    </div>
  );
}

const init = (initialCount) => {
  return {count: initialCount};
}

const lazyReducer = (state, action) => {
  switch (action.type) {
    case actionType.INCREMENT:
      return {count: state.count + 1};
    case actionType.DECREMENT:
      return {count: state.count - 1};
    case actionType.RESET:
      return init(action.payload);
    default:
      throw new Error();
  }
}

const CounterWithReducerLazyInitialzation = ({ initialCount }) => {
  const [state, dispatch] = useReducer(lazyReducer, initialCount, init);

  //test useCallback
  /**
   * 
    Được sử dụng để chặn việc render không cần thiết giữa parent và children component.
   */
  const resetCallback = useCallback(() => {
    dispatch({type: actionType.RESET, payload: initialCount})
  }, [state.count])

  const incrementCallback = useCallback(() => {
    dispatch({type: actionType.INCREMENT })
  }, [state.count])

  const decrementCallback = useCallback(() => {
    dispatch({type: actionType.DECREMENT })
  }, [state.count])

  return (
    <div>
      Count: {state.count}
      <button
        onClick={
          // () => dispatch({type: actionType.RESET, payload: initialCount})
          resetCallback
        }>

        Reset
      </button>
      <button onClick={
        // () => dispatch({type: actionType.DECREMENT})
        decrementCallback
      }>-</button>
      <button onClick={
        // () => dispatch({type: actionType.INCREMENT})
        incrementCallback
      }>+</button>
    </div>
  );
}

// use customhook
const useCustomHook = (props) => {
  console.log('custom-hook-props: ', props)
  const [isOnline, setIsOnline] = useState(null)

  useEffect(() => {
    if (isOnline !== props) {
      setIsOnline(props)
    }
    return () => { }
  },
    [isOnline] // không có thì luôn chạy, có thì chỉ chạy khi isOnline thay đổi.
  )

  return isOnline
}

//useContext
const themes = {
  light: {
    foreground: "black",
    background: "white"
  },
  dark: {
    foreground: "white",
    background: "black"
  }
};
const TestContext = React.createContext(themes.light)

const TestContextButton = () => {
  const theme = useContext(TestContext);

  return (
    <button style={{ background: theme.background, color: theme.foreground }}>
      I am styled by theme context!
    </button>
  );
}



const App = () => {

  //test useState
  const [count, setCount] = useState(defaultCount)
  const [stringTest, setStringTest] = useState(defaultString)

  //virtual api
  const testPromiseSuccess = new Promise((resolve, reject) => {
    console.log('called api promise!')
    setTimeout(() => {
      resolve('api success')
    }, 3000)
  })

  // const testPromiseError = new Promise((resolve, reject) => {
  //   console.log('called api promise!')
  //   setTimeout(() => {
  //     reject('failed')
  //   }, 3000)
  // })


  // test custom hook
  const isOnline = useCustomHook('test')
  console.log('customHook - isonline', isOnline)

  //test useEffect
  /**
   * 
    1. Bạn gây ra một event render (thay đổi state, hoặc re-renders từ cha)
    2. React render Component của bạn (Gọi nó)
    3. Màn hình được cập nhật UI
    4. Cuối cùng useEffect chạy
   */
  useEffect(() => {
    console.log('call useEffect!')
    // setStringTest(`called useEffect - ${stringTest}`) //= error deep update
    testPromiseSuccess.then((response) => {
      if (response === 'api-success') {
        // setStringTest(`called useEffect - ${stringTest} - success`) //= error loop update
      }
      if (response !== stringTest) {
        setStringTest(response)
      }
    })
    return () => {
      console.log('call clear effect')
    }
  })

  //test useLayoutEffect
  /**
   * 
    1. Bạn gây ra một event render (thay đổi state, hoặc re-renders từ cha)
    2. React render Component của bạn (Gọi nó)
    3. useLayoutEffect chạy 
    4. Đợi useLayoutEffect hoàn tất rồi cập nhật UI
   */
  useLayoutEffect(() => {
    console.log('call layout effect')
    // setStringTest(`called useLayoutEffect - ${stringTest}`) //= error deep update
    testPromiseSuccess.then((response) => {
      if (response === 'success') {
        // setStringTest(`called useLayoutEffect - ${stringTest} - success`) //= error loop update
      }
      if (response !== stringTest) {
        setStringTest(response)
      }
    })
    return () => {
      console.log('call clear layout effect')
    }
  })

  //test React.memo
  const Header = ({ title }) => <h1>{title}</h1>
  const MemoHeader = React.memo(Header) //khong xuat hien trong devtool
  // export default React.memo(Header) 

  const List = ({ listItems }) => {
    return (<ul>
      {listItems.map((item) => (<li key={item}>item</li>))}
    </ul>)
  }
  const MemoList = React.memo(List) //khong xuat hien trong devtool
  // export default React.memo(Header) 

  const ListPage = ({ dataList, title }) => (
    <div>
      <MemoHeader title={title} />
      <MemoList listItems={dataList} />
    </div>
  )

  // test useRef  /* i hate ref */
  /**
    Là viết tắt cho reference
    Là cách mà React sẽ truy cập tới DOM (dom thực, không phải dom ảo)
   */
  // const refContainer = useRef(initialValue)
  const TextInputWithFocusButton = () => {
    const inputEl = useRef(null);
    const onButtonClick = () => {
      // `current` points to the mounted text input element
      inputEl.current.focus();
    };
    return (
      <div>
        <input ref={inputEl} type="text" />
        <button onClick={onButtonClick}>Focus the input</button>
      </div>
    );
  }

  //test useImperativeHandle
  /**
   * 
    useImperativeHandle customizes the instance value that is exposed to parent components when using ref.
    As always, imperative code using refs should be avoided in most cases.
    useImperativeHandle should be used with forwardRef
   */
  //useImperativeHandle(ref, createHandle, [deps])
  let FancyInput = (props, ref) => {
    const inputRef = useRef();
    useImperativeHandle(ref, () => ({
      focus: () => {
        inputRef.current.focus();
      }
    }));
    return <input ref={inputRef} />;
  }
  FancyInput = forwardRef(FancyInput);

  // test useDebugValue
  /** useDebugValue can be used to display a label for custom hooks in React DevTools. */
  // useDebugValue(value)
  const useFriendStatus = (friendID) => {
    const [isOnline, setIsOnline] = useState(null);
  
    // ...
  
    // Show a label in DevTools next to this Hook
    // e.g. "FriendStatus: Online"
    useDebugValue(isOnline ? 'Online' : 'Offline');
  
    return isOnline;
  }

  console.log('rendered')
  return (
    <TestContext.Provider value={themes.dark}>
      <div>
        <p>You clicked {count} times</p>
        <button onClick={() => setCount(count + 1)}>
          Click me
        </button>
        <p>You clicked {stringTest} times</p>
        <button onClick={() => {
          let newString = `clicked-${stringTest}`
          setStringTest(newString)
        }}>
          Click me
        </button>
      </div>
      <TestContextButton />
      <CounterWithReducer />
      <CounterWithReducerLazyInitialzation initialCount={2} />
      <ListPage dataList={['asdf', 'qwer', 'zxcv']} title='test React.memo'/>
      <TextInputWithFocusButton />
      <FancyInput />
    </TestContext.Provider>
  );
}
//*/

export default App;
