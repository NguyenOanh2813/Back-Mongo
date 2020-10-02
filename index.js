const express = require('express')
const bodyParser = require('body-parser')
const cors = require("cors")

const PORT = 8000
const api = require('./routes/api')
const app = express()

// CORS HEADERS MIDDLEWARE
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token, x-refresh-token, _id");

    res.header(
        'Access-Control-Expose-Headers',
        'x-access-token, x-refresh-token'
    );

    next();
});

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));


app.use('/api', api)
app.get('/', (req,res) => {
    res.send('Hello')
})

app.listen(PORT, function(){
    console.log("Server is running on port " +PORT)
})