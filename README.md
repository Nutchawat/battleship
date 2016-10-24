# Battleship

## How to use
1. Install node dependencies with:

    ```
    npm install
    ```
    or update if ```package.json``` in project added dependencies with:
    ```
    npm update
    ```
2. Start the node server by default at ```localhost:3000``` with:

    ```
    npm start
    ```
    or manually with:
    ```
    node app.js <PORT>
    ```
   When connecting url ```localhost:3000``` in the browser. 
   It will route to ```localhost:3000/#/deploy``` which show the board and all ships are deployed automatically. 

    ![Frontend Deploy Page](https://github.com/Nutchawat/battleship/tree/master/img/frontend_deploy_page.png)

3. go to back-end example api views at ```localhost:3000/api```

    ![Backend API Page](https://github.com/Nutchawat/battleship/tree/master/img/backend_api_page.png)

## How to test
1. Install mocha globally is used to run Chakram tests with:
   
    ```
    npm install -g mocha
    ```
2. Start ```Mocha test runner``` with:
    
    ```
    mocha ./path/to/testfile
    ```
    
    ![Mocha Test Result](https://github.com/Nutchawat/battleship/tree/master/img/mocha_test.png)

## Project structure
- ```package.json``` - file describing the node.js project and its dependencies
- ```app.js``` - main application file, used to start the application
- ```src``` - contains all back-end application
- ```src/views``` - contains all example api views
- ```public``` - contains all front-end application
