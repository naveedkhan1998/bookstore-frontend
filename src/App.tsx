// App.js
import MainPage from "./components/MainPage";
import LoginReg from "./components/LoginReg";

function App() {
  const isLogin = true;
  return (
    <>
      {isLogin ? (
        <MainPage />
      ) : (
        <LoginReg />
      )}
    </>
  );
}

export default App;
