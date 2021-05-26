const express = require("express")
const https = require('https')
const expressHandlebars = require('express-handlebars')

// The URL for sending requests to the backend hosted on Firbase Functions
const Url = "https://us-central1-tigk-captain-america.cloudfunctions.net/Nodes"

const app = express()


app.set("views", "view")

app.engine("hbs", expressHandlebars({
    defaultLayout: "main.hbs"
}))

//*************************************************** getNodes(callback) *************************************************************** */
//Calls get request to API and fetches latest driving path
//************************************************************************************************************************************** */
function getNodes(callback){
    https.get(Url, response =>{
        response.setEncoding("utf8")
        let body = ""
        response.on("data", data => {
            body += data
        })
        response.on("end", () =>{
            body = JSON.parse(body)
            callback(null, body)
        })
        response.on("error", err =>{
            callback(error)
        })
    })
}

//**************************************************** app.get("/") ********************************************************************* */
//Loads a view with the latest driving path, visualizing drivingpath with lines and nodes. Also displays if a node was a collision point.
//*************************************************************************************************************************************** */
app.get("/", function(request, response){
    getNodes(function(error, drivingPath){
        if(error){
            console.log(error)
        }
        else{
            const model = {
                path: drivingPath[1].Nodes
            }
            console.log(model.path)
            response.render("index.hbs", {drivingPath: JSON.stringify(model)})
        }
    })
})

app.listen(8080, function(){
    console.log("listening on 8080")
})