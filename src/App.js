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
  useState
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

// test useState
///*
const defaultCount = 0
const defaultString = 'tui la tran thanh tai'

// use customhook
const useCustomHook = (props) => {
  console.log('custom-hook-props: ', props)
  const [isOnline, setIsOnline] = useState(null)

  useEffect(() => {
    if (isOnline !== props) {
      setIsOnline(props)
    }
    return () => { }
  })

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
    </TestContext.Provider>
  );
}
//*/

export default App;
