# Pronnect

# Backend Dependencies

    "bcryptjs": "^2.4.3",
    "body-parser": "^1.18.3",
    "concurrently": "^4.1.0",
    "express": "^4.16.4",
    "gravatar": "^1.6.0",
    "jsonwebtoken": "^8.3.0",
    "mongoose": "^5.3.12",
    "passport": "^0.4.0",
    "passport-jwt": "^4.0.0",
    "validator": "^10.9.0"

    Note: To ease installation you can copy this set of dependencies to the package.json and simply run a "npm install".

# Frontend Dependencies

    "axios": "^0.18.0",
    "classnames": "^2.2.6",
    "jwt-decode": "^2.2.0",
    "moment": "^2.22.2",
    "react": "^16.6.3",
    "react-dom": "^16.6.3",
    "react-moment": "^0.8.4",
    "react-redux": "^5.1.1",
    "react-router-dom": "^4.3.1",
    "react-scripts": "2.1.1",
    "redux": "^4.0.1",
    "redux-thunk": "^2.3.0"

    Note: To ease installation you can copy this set of dependencies to the package.json and simply run a "npm install".

# DEV dependencies

    "nodemon": "^1.18.6"

    Note: run "npm i -D nodemon" to add it as dev dependency.

# Server config

    Backend node server     => port 5000
    Frontend react server   => port 3000
    The start point for the backend server is the server.js file in the project root folder. I have created 2 separate scripts for running it.
    1. "npm run server"         - To run backend node server using nodemon.
    2. "npm start"              - The usual one time server run script.
    3. "npm run dev"            - Runs backend node and frontend react server simultaneously using concurrently.
    4. "npm run pronect"         - Runs frontend react server only.
    5. "npm run pronect-install" - Installs frontend react app.

# License

    Choose the MIT license instead of the ISC when you are doing "npm init".

# Proxy server for react app

    Add the line "proxy": "http://localhost:5000" to your react package.json to make it hit your node server.
