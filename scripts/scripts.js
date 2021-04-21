const https = require('https')
const Url = "https://us-central1-tigk-captain-america.cloudfunctions.net/Nodes"

const options = {
    hostname: "us-central1-tigk-captain-america.cloudfunctions.net",
    path: "/Nodes",
    method: "GET"
}

const req = https.request(options, res => {
    console.log(`statusCode: ${res.statusCode}`)
    res.on('data', d => {
        process.stdout.write(d)
    })
})

req.on("error", error => {
    console.log(error)
})

req.end()