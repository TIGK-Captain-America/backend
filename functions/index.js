const functions = require("firebase-functions")
const express = require('express')
const admin = require('firebase-admin')
const cors = require('cors')
admin.initializeApp()
const db = admin.firestore()

const app = express()

app.use(
    express.urlencoded({
        extended: true
    })
)

app.use(express.json())

// ---------------------------------------------------------------------------------------------------      1
app.get("/", async (request, response) =>{
    //Creates a reference to the DrivingPath collection and fetch the latest driving path
    const nodeRef = await db.collection("DrivingPath").orderBy("createdAt", "desc").limit(1)

    var node = []
    //Iterate through fetched data from cloud firestore and extract documentId and data.
    await nodeRef.get().then(snapshot =>{
        snapshot.docs.forEach(doc =>{
            node.push(doc.id, doc.data())
        })
    })

    response.status(200).send(JSON.stringify(node))
})
//----------------------------------------------------------------------------------------------------      2
app.post("/", async (request, response) =>{
    const dataHandler = request.body.stringFromRbp
    var collision = false
    var startOfDrivingPath = false

    var data = dataHandler.split(",")

    //Convert distance and angle to x and y coordinates
    var x = Math.cos(parseInt(data[1]) * Math.PI) * parseInt(data[0])
    var y = Math.sin(parseInt(data[1]) * Math.PI) * parseInt(data[0])

    

    if(data[2] == "T") collision = true
    else if(data[2] == "F") collision = false
    else startOfDrivingPath = true


    var positions = {
        "x": parseInt(x),
        "y": parseInt(y),
        "w": parseInt(data[1])
    }

    const node ={
        "collision": collision,
        "positions": positions
    }
    
    if(isNaN(x) || isNaN(y) || isNaN(data[1])){
        response.status(500).send("Nodes are not defined")
    }
    else{
        //Creates a new document in cloud firestore when the mower starts a new driving session
        if(startOfDrivingPath == true){
            const timestamp = admin.firestore.Timestamp.now()
            const nodes = {"createdAt": timestamp, "Nodes": [node]}
            await db.collection("DrivingPath").doc().create(nodes).then(response.status(201).send()).catch(function(error){
                var errorCode = error.code
                response.status(500).send(errorCode)
            })
        }
        //Add nodes and collision to the existing driving session
        else{
            const nodeRef = await db.collection("DrivingPath").orderBy("createdAt", "desc").limit(1)
            console.log(node)

            await nodeRef.get().then(snapshot =>{
                snapshot.docs.forEach(doc =>{
                    db.collection("DrivingPath").doc(doc.id).update({"Nodes": admin.firestore.FieldValue.arrayUnion(node)}).then(response.status(204).send())
                })
            })
        }
    }
})

exports.Nodes = functions.https.onRequest(app)

/*
1.	Read and write positions where the mower have been.
    a.	Add coordinates to database structure.
        i.	Transform distance and angle to x and y coordinates.
        ii.	Differentiate between driving sessions.
            1.	If driving session is new, coordinate starting position is 0.0.
        iii.	If driving session is active, add new position to existing node list.
            1.	Transform data into readable variable.
    b.	Retrieve coordinates from cloud Firestore.
        i.	Retrieve data from all the nodes in cloud firebase database.
            1.	Package into a JSON object and send via HTTP protocol.
2.	Save each position where collision happened.
    a.	Save position on event.
        i.	If collision occurred, push position to database.
*/