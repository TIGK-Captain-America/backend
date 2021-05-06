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

var drivingPath = []

async function getNodes(){
    const options = {
        hostname: "us-central1-tigk-captain-america.cloudfunctions.net",
        path: "/Nodes",
        method: "GET"
    }

    const req = https.request(options, res => {
        console.log(`statusCode: ${res.statusCode}`)
        res.on('data', d => {
            process.stdout.write(d)
            drivingPath.push(d)
        })
    })
    
    req.on("error", error => {
        console.log(error)
    })
    
    req.end()
}

app.get("/", function(request, response){
    getNodes()

    response.render("index.hbs", model)
})

app.listen(8080, function(){
    console.log(drivingPath)
})