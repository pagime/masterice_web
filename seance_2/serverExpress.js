const http = require('http');
const port = 3000;
const fs = require('fs');
const pug = require('pug');
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const uuidv4 = require('uuid/v4');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(express.static(path.join(__dirname,'public')));

const compiledFunction = pug.compileFile('views/template500.pug');

const compiledFunctionS = pug.compileFile('views/templateSucces.pug');

app.get('/', function (req, res){
    fs.readFile("cities.json", 'utf8', (err,data) => {
        if (err) {
            const generated500Template = compiledFunction();
            res.status(500).send(generated500Template);
            return
        }

        const generatedTemplateSucces = compiledFunctionS({
            data: data
        });
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end(generatedTemplateSucces)
    })
});

app.post('/city', urlencodedParser, function(req, res) {
    fs.stat('cities.jon', function(err) {
        if (err) {
            fs.appendFile('cities.json', '', (err) => {
                if (err) console.log("création du fichier JSON");
            });
        }
    });

    var jsonP = JSON.parse(fs.readFileSync('cities.json', 'utf8'));
    var ville = jsonP['cities'];

    for (var i = 0; i < ville.length; i++) {
        if (ville[i]['name'] == req.body.ville){
            res.statusCode = 500;
            const generated500Template = compiledFunction();
            res.status(500).send(generated500Template);
            return
        }
    }

    let city = {
        "id" : uuidv4(),
        "name" : req.body.ville
    };

    jsonP['cities'].push(city);

    let dataP = JSON.stringify(jsonP);
    fs.writeFile('cities.json', dataP, function (err) {
        if (err) throw err;
    });
    const generatedTemplateSucces = compiledFunctionS({
        data: dataP
    });
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end(generatedTemplateSucces)
});

app.put('/city/:id', urlencodedParser, function(req, res) {
    fs.stat('cities.jon', function(err) {
        if (err) {
            fs.appendFile('cities.json', '', (err) => {
                if (err) console.log("création du fichier JSON");
            });
        }
    });

    var jsonP = JSON.parse(fs.readFileSync('cities.json', 'utf8'));
    var ville = jsonP['cities'];

    for (var i = 0; i < ville.length; i++) {
        if (ville[i]['name'] === req.body.ville){
            res.statusCode = 500;
            const generated500Template = compiledFunction();
            res.status(500).send(generated500Template);
            return
        }
    }

    for (var i = 0; i < ville.length; i++) {
        if (ville[i]['id'] === req.body.id){
            ville[i]['name'] = req.body.ville
        }
    }

    let dataP = JSON.stringify(jsonP)
    fs.writeFile('cities.json', dataP, function (err) {
        if (err) throw err;
        console.log('Saved!');
    });

    const generatedTemplateSucces = compiledFunctionS({
        data: dataP
    });
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/html');
    res.end(generatedTemplateSucces)
});

app.delete('/city/:id', urlencodedParser, function(req, res) {
    fs.stat('cities.jon', function(err) {
        if (err) {
            fs.appendFile('cities.json', '', (err) => {
                if (err) console.log("création du fichier JSON");
            });
        }
    });

    var jsonP = JSON.parse(fs.readFileSync('cities.json', 'utf8'));
    var ville = jsonP['cities'];

    for (var i = 0; i < ville.length; i++) {
        if (ville[i]['id'] === req.body.id){
            jsonP['cities'].splice(i, 1);
        }
    }

    let dataP = JSON.stringify(jsonP);
    fs.writeFile('cities.json', dataP, function (err) {
        if (err) throw err;
        console.log('Saved!');
    });

    const generatedTemplateSucces = compiledFunctionS({
        data: dataP
    });
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end(generatedTemplateSucces)
});

app.listen(port, () => {
    console.log(`Server running at port: ${port}`)
});