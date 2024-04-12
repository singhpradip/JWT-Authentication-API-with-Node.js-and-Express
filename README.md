# This repository provides a comprehensive solution for building secure authentication APIs using JSON Web Tokens (JWT) in Node.js with Express. The API allows users to sign up, log in, and log out securely.

## Things I learned and Implimented:
- MVC framework
- creating and using middlewares
- Modular architecture
- JWT for authentication
- separate file routes
- Mongoose ODM for MongoDB database
- Joi library for data validation
- bcrypt for cryptography
- dotenv

## How does this APIs works, you can test it using PostMan
Registration:
- When a user wants to create an account, they access the registration endpoint (/register) of the API.
- They provide their desired username, email, and password in the request body.
- The server validates the provided data to ensure it meets the required criteria (e.g., username must be unique, email must be valid).
- If the data passes validation, the server hashes the password securely using bcrypt and stores the user's information in the database.
- Finally, the server generates a JWT (JSON Web Token) containing the user's ID and signs it with a secret key. This token is then sent back to the client as part of the registration response.

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
- Middleware Integration: Utilize middleware functions to authenticate and Validate API endpoints.
- Error Handling: Implement error handling mechanisms to provide informative responses for various scenarios.

This project aims to provide a flexible and reliable authentication solution for building secure APIs with JWT authentication. Whether you're creating a web application, mobile app backend, or any other type of server-side application, this repository serves as a solid foundation for implementing user authentication securely.
