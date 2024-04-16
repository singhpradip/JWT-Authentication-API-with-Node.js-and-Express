# This repository provides a comprehensive solution for building secure authentication APIs using JSON Web Tokens (JWT) in Node.js with Express. The API allows users to sign up, verify email through OTP, resend OTP, log in, change password, forgot password and show user Info securely.

## Things I learned and Implimented in this project:
- MVC framework
- creating and using middlewares
- Modular architecture
- JWT for authentication
- separate file routes
- Mongoose ODM for MongoDB database
- Joi library for data validation
- bcrypt for cryptography
- Gmail API and nodemailer to send emails
- dotenv

# How does this APIs works ?, you can test it using PostMan !! 
## Registration
#### Endpoint: /register
#### Method: POST
#### Description: Allows users to create a new account.
  - The user provides their desired username, email, and password in the request body.
  - The server validates the provided data to ensure it meets the required criteria.
  - If the data passes validation, the server sends an OTP (One-Time Password) to the user's email for verification.
  - The user's information is securely stored in the database after successful verification.

# Verify Account
#### Endpoint: /register/verify-account
#### Method: POST
#### Description: Verifies the user's account using the OTP sent during registration.
  - The user provides their OTP in the request body, along with the tempToken in the URL query parameters.
  -  The server extracts the email from the tempToken and retrieves the user associated with that email.
  -  If the user is found and the OTP provided matches the one sent during registration, the user's account is marked as verified, and they receive a JWT (JSON Web Token) for authentication.

Note: Ensure that the tempToken obtained from the registration response is included in the URL query parameters. This tempToken contains the encoded email, which is used to identify the user during account verification. Additionally, the OTP should be provided in the request body for validation.

Login:
- To log in, the user accesses the login endpoint (/login) and provides their email and password in the request body.
- The server validates the credentials by checking if the provided email exists in the database and if the password matches the hashed password stored for that email.
- If the credentials are valid, the server generates a new JWT containing the user's ID and signs it with the secret key.
- This token is sent back to the client as part of the login response.

showInfo:
- The showInfo endpoint (/showInfo) is a protected route that requires authentication. Only users with a valid JWT can access this endpoint.
- To access showInfo, the client includes the JWT in the request headers, typically using the Authorization header with the value Bearer token.
- The server verifies the authenticity of the token by decoding it and validating the signature against the secret key.
- If the token is valid, the server extracts the user's ID from the token and uses it to fetch the user's information from the database.
- Finally, the server responds with the requested user information, allowing the client to display it to the user.


## Key Features:

- User Authentication: Implement a robust authentication system using JWT to securely authenticate users.
- Proper Response Handlling
- Middleware Integration: Utilize middleware functions to authenticate and Validate API endpoints.
- Error Handling: Implement error handling mechanisms to provide informative responses for various scenarios.

This project aims to provide a flexible and reliable authentication solution for building secure APIs with JWT authentication. Whether you're creating a web application, mobile app backend, or any other type of server-side application, this repository serves as a solid foundation for implementing user authentication securely.


# Frontend of this project is being developed in 'frontend' branch of this repo. usinf React.
