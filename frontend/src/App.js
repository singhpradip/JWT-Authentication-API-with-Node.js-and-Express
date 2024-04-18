import './App.css';

import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import ForgetPassword from './components/auth/ForgetPassword';
import {BrowserRouter, Routes, Route} from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login/>}></Route>
        <Route path='/signup' element={<Signup/>}></Route>
        <Route path='/forget-password' element={<ForgetPassword/>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
