# Battleship

## How to use
1. Install **MongoDB** from: [https://www.mongodb.org/downloads](https://www.mongodb.org/downloads)
2. Install **Node.js** from: [https://nodejs.org/en/download](https://nodejs.org/en/download)
3. Install node dependencies with:

    ```
    npm install
    ```
    or update if ```package.json``` in project added dependencies with:
    ```
    npm update
    ```
4. Start the database server which located to ```database``` directory using shell scripts with:
    
    ```
    ./start_database.sh
    ```
5. Start the node server by default at ```localhost:3000``` with:

    ```
    npm start
    ```
    or manually with:
    ```
    node app.js <PORT>
    ```
   When connecting url ```localhost:3000``` in the browser. 
   It will route to ```localhost:3000/#/deploy``` which show the board and ships deployed. 

6. go to back-end example api views at ```localhost:3000/api```

## How to test
1. Install mocha globally is used to run Chakram tests with:
   
    ```
    npm install -g mocha
    ```
2. Start ```Mocha test runner``` with:
    
    ```
    npm test
    ```
    or manually with:
    ```
    mocha ./path/to/testfile
    ```

## Project structure
- ```package.json``` - file describing the node.js project and its dependencies
- ```app.js``` - main application file, used to start the application
- ```src``` - contains all back-end application
- ```src/views``` - contains all example api views
- ```public``` - contains all front-end application
