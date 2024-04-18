import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import ApiService from '../../services/ApiService';


function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [verificationUrl, setVerificationUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3956/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        setErrorMessage(data.message);
        return;
      }

      const data = await response.json();
      setVerificationUrl(data.verificationUrl);
    } catch (error) {
      setErrorMessage('Internal server error');
      console.error(error);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center bg-dark vh-100">
      <div className="bg-white p-3 rounded w-25">
        <h3>Create new account:</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              placeholder="Enter your Full Name"
              className="form-control rounded-0"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              placeholder="Enter your Email"
              className="form-control rounded-0"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              placeholder="Enter your Password"
              className="form-control rounded-0"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-success w-100">
            Sign up
          </button>
          <p>{errorMessage}</p>
          {verificationUrl && (
            <p>
              Verify your account using OTP sent to your email.{' '}
              <a href={verificationUrl}>Click here</a> to verify.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}


export default Signup;
