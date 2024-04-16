# Secure Authentication APIs with JSON Web Tokens (JWT) in Node.js

I created this project from scratch to provide a comprehensive solution for building secure authentication APIs using JSON Web Tokens (JWT) in Node.js with Express. The API allows users to perform the following actions securely:

- Sign up
- Verify email through OTP
- Resend OTP
- Log in
- Change password
- Forgot password
- Show user info

This project aims to offer a robust and reliable authentication solution, ensuring the security of user data and authentication processes.


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

- **Endpoint**: `/register`
- **Method**: POST
- **Description**: Allows users to create a new account.
    - The user provides their desired username, email, and password in the request body.
    - The server validates the provided data to ensure it meets the required criteria.
    - If the data passes validation, the server sends an OTP (One-Time Password) to the user's email for verification.
    - The server also sends a verification URL containing a temporary token (`tempToken`) as a response, which the user can use to verify their account.
    - After receiving the OTP, the user verifies their account by hitting the verification URL along with the OTP.
  

## Verify Account

- **Endpoint**: `/register/verify-account`
- **Method**: POST
- **Description**: Verifies the user's account using the OTP sent during registration.
    - The user provides their OTP in the request body, along with the tempToken in the URL query parameters.
    - The server extracts the email from the tempToken and retrieves the user associated with that email.
    - If the user is found and the OTP provided matches the one sent during registration, the user's account is marked as verified, and they receive a JWT (JSON Web Token) for authentication.

**Note**: Ensure that the `tempToken` obtained from the registration response is included in the URL query parameters. This `tempToken` contains the encoded email, which is used to identify the user during account verification. Additionally, the OTP should be provided in the request body for validation.

## Resend OTP

- **Endpoint**: `/resendOtp`
- **Method**: POST
- **Description**: REquest to resends the OTP if the user don't receive email with OTP for account verification or Password reset.
    - The user can request to resend the OTP if they didn't receive it initially.
    - The user must provide their email along with the `tempToken` received during registration or forget-password in the request body for authentication.
    - The server decodes the email from the `tempToken` and resends the OTP to the user's email.
    - A new `tempToken` is issued with a renewed expiry time.

## Login

- **Endpoint**: `/login`
- **Method**: POST
- **Description**: Allows users to log in to their verified accounts.
    - Requires the user's email and password in the request body.
    - Upon successful authentication, the server issues a long-lived access token.
    - This access token can be used to access protected routes and retrieve account information.

## Show User Info

- **Endpoint**: `/showInfo`
- **Method**: GET
- **Description**: Retrieves the user's information.
    - Requires a valid JWT in the request headers for authentication.
        - The client includes the JWT in the request headers, typically using the Authorization header with the value Bearer token.
        - The server verifies the authenticity of the token by decoding it and validating the signature against the secret key.
        -  If the token is valid, the server extracts the user's ID from the token and uses it to fetch the user's information from the database.
        -  Finally, the server responds with the requested user information, allowing the client to display it to the user.

## Change Password

- **Endpoint**: `/change-password`
- **Method**: PUT
- **Description**: Allows users to change their passwords securely.
    - Requires authentication token in the request headers for user authentication.
        - The client includes the JWT in the request headers, typically using the Authorization header with the value Bearer token.
        - The server verifies the authenticity of the token by decoding it and validating the signature against the secret key.
        - If the token is valid, the server allows access to the endpoint.
    - Requires the user's current password and the new password in the request body.

## Forget Password

- **Endpoint**: `/forget-password`
- **Method**: POST
- **Description**: Initiates the password recovery process by sending an OTP to the user's email.
    - Requires the user's email in the request body.
- **Response**: Sends a temporary token (`tempToken`) as a response. This token initiates the password reset session, and the user can use it to verify their identity and reset their password. The OTP sent via email is valid only for the duration of this session.

## Verify Forget Password

- **Endpoint**: `/forget-password/verify`
- **Method**: POST
- **Description**: Verifies the OTP sent during the forget password process and allows users to set a new password.
    - Requires the OTP in the request body.
    - During initiation the forget password process, the user have received an OTP via email and a temporary token (`tempToken`) as a response. Users now need to hit the `/forget-password/verify` endpoint with the `tempToken` in the URL and the OTP in the request body to verify their identity and proceed to set a new password.
    - If the user did not receive the OTP, they can request a new OTP by hitting the `/resendOtp` endpoint with the `tempToken` received in the initial forget password response.

# Middleware

### Token Verification

- **Function**: `verifyToken`
- **Description**: Verifies the JWT provided in the request headers.
    - If the token is valid, extracts the user ID and proceeds with the request.

### Temporary Token Verification

- **Function**: `verifyTempToken`
- **Description**: Parses the email from the `tempToken` provided in the query parameters of the URL.
    - Used for verifying account and forget password OTPs.

### OTP Verification

- **Function**: `otpVerify`
- **Description**: Verifies the OTP sent along with the email.
    - Used after `verifyTempToken` middleware to ensure the validity of the OTP.

# Key Features:
- **User Authentication**: Implement a robust authentication system using JWT to securely authenticate users.
- **Proper Response Handling**: Ensure proper formatting and informative responses for all API endpoints.
- **Middleware Integration**: Utilize middleware functions to authenticate, validate, and authorize API endpoints, including token verification and OTP validation.
- **Error Handling**: Implement error handling mechanisms to provide informative responses for various scenarios, ensuring graceful handling of errors throughout the application.
  
This project aims to provide a flexible and reliable authentication solution for building secure APIs with JWT authentication. Whether you're creating a web application, mobile app backend, or any other type of server-side application, this repository serves as a solid foundation for implementing user authentication securely.



# Frontend of this project is being developed in 'frontend' branch of this repo. usinf React.
