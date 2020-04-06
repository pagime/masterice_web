const http = require('http');
const port = 3000;
const fs = require('fs');
const pug = require('pug');
const file = process.argv[2];

const compileLine = pug.compileFile('template.pug');

const server = http.createServer(
    (req, res) => {
        const generatedTemplate = compileLine({
            name: ''
        });
        if (req.url !== '/favicon.ico' || req.url !== '/') {

            fs.readFile(file, 'utf8', (err, data) => {
                if (err) {
                    console.error(err);
                    process.exit(1);
                }
                let results = data.toString().split(/\r\n|\n/);
                let tab = '<table><tr><td>Identifiant</td><td>Ville</td></tr>';
                for (let result of results) {
                    user = result.split(';');
                    tab += `<tr><td>${user[0]}</td><td>${user[1]}</td></tr>`
                }
                tab += '<style type="text/css">td { border: 2px solid lightblue; }</style><style type="text/css">td { background-color: lightgreen; }</style>';
                tab += '</table>';

                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/html');
                res.end(generatedTemplate + tab)
            })
        }
    }
    );

server.listen(port, () => {
    console.log('Server running at port' + port)
});