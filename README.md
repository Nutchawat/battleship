# Taskworld take home : Battleship

## How to use
1. Install node dependencies with:

    ```
    npm install
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

3. go to back-end example api views at ```localhost:3000/api```

## Project structure
- ```package.json``` - file describing the node.js project and its dependencies
- ```app.js``` - main application file, used to start the application
- ```src``` - contains all back-end application
- ```src/views``` - contains all example api views
- ```public``` - contains all front-end application
