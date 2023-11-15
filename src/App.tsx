// App.js
import MainPage from "./pages/MainPage";
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
