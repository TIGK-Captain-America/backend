const express = require("express")
const https = require('https')
const handlebars = require('handlebars')
const expressHandlebars = require('express-handlebars')

const Url = "https://us-central1-tigk-captain-america.cloudfunctions.net/Nodes"

const app = express()


app.set("views", "view")
app.use("/script", express.static("./script/"))

app.engine("hbs", expressHandlebars({
    defaultLayout: "main.hbs"
}))



function getNodes(callback){
    var drivingPath = []
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
            response.render("index.hbs", model)
        }
    })
})

app.listen(8080, function(){
    console.log("listening on 8080")
})