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
    const dataRef = await db.collection("DrivingPath")
    //const query = dataRef.where('Nodes', 'array-contains')

    var node = []

    await dataRef.get().then(snapshot =>{
        snapshot.docs.forEach(doc =>{
            console.log(doc.id, doc.data())
            node.push(doc.id, doc.data())
        })
    })

    /*let node = []
    dataRef.forEach(doc=>{
        let id = doc.id
        let data = doc.data()

        node.push[{id, ...data}]
    })*/

    console.log(node)
    response.status(200).send(JSON.stringify(node))
})

exports.test = functions.https.onRequest(app)


/*exports.getData = functions.https.onRequest((request, response) =>{
    var dataRef = db.collection("DrivingPath").get()

    const node = []
    dataRef.then((snapshot) => {

        snapshot.docs.forEach(doc => {
            let id = doc.id
            let data = doc.data()
            
        
            //console.log(id, '=>', data)
            node.push(JSON.stringify(data))
            //console.log(node)
        })
    })
    response.status(200).send(node)
})

app.use()*/
