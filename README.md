# pronnect

# Dependencies

    "bcryptjs": "^2.4.3",
    "body-parser": "^1.18.3",
    "express": "^4.16.4",
    "gravatar": "^1.6.0",
    "jsonwebtoken": "^8.3.0",
    "mongoose": "^5.3.12",
    "passport": "^0.4.0",
    "passport-jwt": "^4.0.0",
    "validator": "^10.9.0"

    Note: To ease installation you can copy this set of dependencies to the package.json and simply run a "npm install".

# DEV dependencies

    "nodemon": "^1.18.6"

    Note: run "npm i -D nodemon" to add it as dev dependency.

# Server config

    Backend node server     => port 5000
    Frontend react server   => port 3000
    The start point for the backend server is the server.js file in the project root folder. I have created 2 separate scripts for running it.
    1. "npm run server" - For development purposes this script is driven by nodemon which wont require you to restart the server.
    2. "npm start" - The usual one time server run script

# License

    Choose the MIT license instead of the ISC when you are doing "npm init".

# Proxy server for react app

    Add the line "proxy": "http://localhost:5000" to your react package.json to make it hit your node server.
