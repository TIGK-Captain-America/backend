const functions = require("firebase-functions");
const express = require('express')
const admin = require('firebase-admin');
admin.initializeApp()
const db = admin.firestore()


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const app = express()


app.get("/", async (request, response) =>{
    const nodeRef = await db.collection("DrivingPath").orderBy("createdAt", "desc").limit(1)

    var node = []

    await nodeRef.get().then(snapshot =>{
        snapshot.docs.forEach(doc =>{
            node.push(doc.id, doc.data())
        })
    })

    response.status(200).send(JSON.stringify(node))
})

app.post("/", async (request, response) =>{
    const nodes = request.body
    console.log(nodes)
    await db.collection("DrivingPath").doc().create(nodes)
    response.status(201)

})

exports.Nodes = functions.https.onRequest(app)
