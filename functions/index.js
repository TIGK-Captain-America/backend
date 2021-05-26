const functions = require("firebase-functions")
const express = require('express')
const admin = require('firebase-admin')
admin.initializeApp()
const db = admin.firestore()

const app = express()

app.use(
    express.urlencoded({
        extended: true
    })
)

app.use(express.json())

//*********************************** app.get("/") ********************************************* */
// Fetches the most recent created DrivingPath from Cloud Firestore
//********************************************************************************************** */

app.get("/", async (request, response) =>{
    //Creates a reference to the DrivingPath collection and fetch the latest driving path
    const nodeRef = await db.collection("DrivingPath").orderBy("createdAt", "desc").limit(1)

    var node = []
    //Iterate through fetched data from cloud firestore and extract documentId and data.
    await nodeRef.get().then(snapshot =>{
        snapshot.docs.forEach(doc =>{
            node.push(doc.id, doc.data())
            
        })
        response.status(200).send(JSON.stringify(node))
    })
})

//********************************** app.post("/") ********************************************* */
//Updates existing document or creates new document depending on the received data from the mower
//********************************************************************************************** */

app.post("/", async (request, response) =>{
    const dataHandler = request.body.stringFromRbp
    var collision = false
    var startOfDrivingPath = false

    const data = dataHandler.split(",")

    //Convert distance and angle to x and y coordinates
    const x = Math.cos(parseInt(data[1]) * Math.PI) * parseInt(data[0])
    const y = Math.sin(parseInt(data[1]) * Math.PI) * parseInt(data[0])

    
    //Checks if the path is a collision or not, or if it is a new driving path
    if(data[3] == "T") collision = true
    else if(data[3] == "F") collision = false
    else if(data[3] == "S") startOfDrivingPath = true
    else response.status(500).send("Collision values are missing")

    const positions = {
        "x": parseInt(x),
        "y": parseInt(y),
        "w": parseInt(data[1]),
        "distance": parseInt(data[0])
    }

    const node ={
        "collision": collision,
        "positions": positions,
        "sensorDistance": parseInt(data[2])
    }
    //Filters usless data
    if(isNaN(x) || isNaN(y) || isNaN(data[1])){
        response.status(500).send("Nodes are not defined")
    }
    //Uploads data
    else{
        //Creates a new document in cloud firestore when the mower starts a new driving session
        if(startOfDrivingPath == true){
            const timestamp = admin.firestore.Timestamp.now()
            const nodes = {"createdAt": timestamp, "Nodes": [node]}
            await db.collection("DrivingPath").doc().create(nodes).then(response.status(201).send()).catch(function(error){
                const errorCode = error.code
                response.status(500).send(errorCode)
            })
        }
        //Add nodes and collision to the existing driving session
        else{
            const nodeRef = await db.collection("DrivingPath").orderBy("createdAt", "desc").limit(1)
            console.log(node)
            //Appends the node sent by the mower to the current DrivingPaths's node array
            await nodeRef.get().then(snapshot =>{
                snapshot.docs.forEach(doc =>{
                    db.collection("DrivingPath").doc(doc.id).update({"Nodes": admin.firestore.FieldValue.arrayUnion(node)}).then(response.status(204).send())
                })
            })
        }
    }
})
//Uploads functions in this file to Firebase Functions
exports.Nodes = functions.https.onRequest(app)