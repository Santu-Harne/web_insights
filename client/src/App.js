import logo from './logo.svg';
import './App.css';
import InputUrl from './components/InputUrl';
import { ToastContainer } from 'react-toastify';



function App() {
  return (
    <div className="App">
      <ToastContainer autoClose='2000' position='top-right' />
      <InputUrl />
    </div>
  );
}

export default App;
