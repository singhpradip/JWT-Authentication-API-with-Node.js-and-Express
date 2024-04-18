// ApiService.js
// require('dotenv').config();

class ApiService {
    constructor() {
      this.baseUrl = 'http://localhost:3956';
    }
  
    async registerUser(userData) {
      try {
        const response = await fetch(`${this.baseUrl}/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error registering user:', error);
        throw new Error('Failed to register user');
      }
    }
  
    // Add more methods for other API endpoints as needed
  }
  
  export default new ApiService();
  