const fs = require('fs');
const csv = require('fast-csv');
const path = require('path');

fs.createReadStream(path.resolve(__dirname, 'assets', 'data.csv'))
    .pipe(csv.parse({headers: true}))
    .on('error', error => console.log(error))
    .on('data', row => console.log(row))
    .on('end', () => console.log("DONE"));