// const http = require('http');
const port = 3000;
// const fs = require('fs');
const pug = require('pug');
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
// const uuidv4 = require('uuid/v4');
let urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(express.static(path.join(__dirname,'public')));

const compiledFunction = pug.compileFile('views/template500.pug');
const showFunction = pug.compileFile('views/templateShow.pug');

const mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/TP_Web', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('Making  connection...'))
    .catch((err) => console.log(err));
const db = mongoose.connection;
const citiesSchema = new mongoose.Schema({
    name: String
});

const Cities = mongoose.model("cities", citiesSchema);

db.on("error", console.error.bind(console, "Connection error: "));
db.once("open", function(){
    // We're connected!
});

// GET
app.get("/", function(req, res) {
    const generatedTemplate = compiledFunction();
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end(generatedTemplate)
} );

// GET
app.get("/cities", function(req, res) {
    Cities.find(function(err, cities) {
        if (err) return console.error(err);

        const affichageTemplate = showFunction({
            Contenu: cities
        });

        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end(affichageTemplate)
    });


} );

// POST
app.post("/name", urlencodedParser, function(req, res) {
    const city = new Cities({ name : req.body.ville});

    city.save(function(err) {
        if (err) return console.error(err);
        res.writeHead(301,
            {Location: '/cities'}
        );
        res.end();
    });
});

// DELETE
app.delete("/city/:id", urlencodedParser, function(req, res) {
    Cities.remove({_id: req.body.id}, function(err, city) {
        if (err) return console.error(err);
        res.json({message : 'Bravo, ville supprimée'});
    })
} );

// PUT
app.put("/city/:id", urlencodedParser, function(req, res) {
    Cities.findById(req.body.id, function(err, city) {
        if (err) return console.error(err);
        city.name = req.body.ville;
        city.save(function(err) {
            if (err) return console.error(err);
            res.json({message : 'Bravo, mise à jour des données OK'});
        })
    })
} );

app.listen(port, () => {
    console.log(`Server running at port: ${port}`)
});