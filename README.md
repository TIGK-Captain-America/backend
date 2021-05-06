# Backend
Cloud service

## Project 
What does the project?<br/>
Creates an API in Firebase functions to retrieve and store data in Firebase Firestore. 

Why the project is useful?<br/>
To store and retrieve the mover driving session, so users can be able to see the visualize the moves path for the latest driving session.

## Project instruction
1. Install Firebase Functions to your application.
2. Install - npm init (package-json). 
3. Install - npm install -g firbase-tools
4. Install - npm install express
5. Install - npm Firebase init -> accept default config -> select Firebase Functions
6. Run and create - Firebase deploy --only-functions

## How to use the project
https://us-central1-tigk-captain-america.cloudfunctions.net/Nodes </br>
To use the project project you need to do http request with ***POST*** and ****GET*** to the http link above.<br/>
***GET*** will retrieve an JSON object with all Nodes, which is the driving session.<br/>
***POST*** will create a new document when a new driving session is started and then add new nodes to that driving session while the mover is driving.   
