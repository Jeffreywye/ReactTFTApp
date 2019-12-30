const express = require("express");
const bodyParser = require("body-parser");
const path = require('path');
const request = require("request");
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'client/build')));

const API_KEY = process.env.API_KEY;
const PORT = process.env.PORT || 5000;

function fetchData(url, callback){
    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            let data = JSON.parse(body);
            callback(data); 
        }
    });
}

app.post('/api', async (req, res) =>{
    let link = req.body.url + API_KEY;
    fetchData(link, function(data){
        res.json(data);
    });
});

app.listen(PORT, () =>{
    console.log(`Server started on Port ${PORT}`);
});