import React from 'react'
import { Link } from 'react-router-dom'

export default function ForgetPassword() {
  return (
    <div className='d-flex justify-content-center align-items-center bg-dark vh-100'>
      <div className='bg-white p-3 rounded w-25'>
        <h3>Reset Password:</h3>
        <form>
            <div className='mb-3'>
                <label htmlFor='email'>Email</label>
                <input type='email' placeholder='Enter your Email'className='form-control rounded-0'/>
            </div>
            <button className='btn btn-success w-100'>Get OTP</button>
            <Link to="/" className='btn btn-default border w-100 bg-light'>Go back to LogIn</Link>
        </form>
      </div>
    </div>
  )
}
