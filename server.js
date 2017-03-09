const http = require('http');


const readline = require('readline');
const fs = require('fs');

var rl = readline.createInterface({
    input: fs.createReadStream('./client_check.js'),
    output: process.sdtout,
    terminal: false
});

var buffer = fs.readFileSync('./client_check.js');

var proxy = http.createServer((req, res) => {
    res.writeHead(200, {"Content-Type": "application/javascript"});
    res.write(buffer);
    res.end();
     
});

proxy.listen(8000);

// Put a friendly message on the terminal
console.log("Server running at http://127.0.0.1:8000/");