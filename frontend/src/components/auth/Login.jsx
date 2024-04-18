import React from 'react'
import { Link } from 'react-router-dom'

function Login() {
  return (
    <div className='d-flex justify-content-center align-items-center bg-dark vh-100'>
      <div className='bg-white p-3 rounded w-25'>
      <h3>Let's Login:</h3>
        <form>
            <div className='mb-3'>
                <label htmlFor='email'>Email</label>
                <input type='email' placeholder='Enter your Email'className='form-control rounded-0'/>
            </div>
            <div className='mb-3'>
                <label htmlFor='password'>Password</label>
                <input type='password' placeholder='Enter your Password' className='form-control rounded-0'/>
            </div>
            <button className='btn btn-success w-100'>Login</button>
            <Link to="/forget-password">Forget Password ?</Link>
            <p>With this, you're aggring to our terms and conditions.</p>
            <Link to="/signup" className='btn btn-default border w-100 bg-light'>Create Account</Link>
        </form>
      </div>
    </div>
  )
}

export default Login
