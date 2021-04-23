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

app.use(
    express.urlencoded({
        extended: true
    })
)

app.use(express.json())

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
    const dataHandler = request.body.stringFromRbp

    var node = []
    const timestamp = admin.firestore.Timestamp.now()

    for(var i = 0; i < dataHandler.length; i += 1){
        var data = dataHandler[i].split(",")

        var x = Math.cos(parseInt(data[1]) * Math.PI) * parseInt(data[0])
        var y = Math.sin(parseInt(data[1]) * Math.PI) * parseInt(data[0])

        var collision = data[2] == "True" ? true: false
        var positions = {
            "x": x,
            "y": y,
            "w": parseInt(data[1])
        }
        node.push({collision, positions})
    }

    const nodes = {"createdAt": timestamp, "Nodes": node}

    await db.collection("DrivingPath").doc().create(nodes).then(response.status(201).send()).catch(function(error){
        var errorCode = error.code
        console.log(errorCode)
    })
})

exports.Nodes = functions.https.onRequest(app)
