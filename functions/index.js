const functions = require("firebase-functions");
const express = require('express')
const admin = require('firebase-admin')
admin.initializeApp()

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const app = express()


exports.test = functions.https.onRequest((request, response) => {
    response.send("Hello World!!!!!!!!")
})