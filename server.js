const http = require('http');
const net = require('net');
const url = require('url');

const readline = require('readline');
const fs = require('fs');

var rl = 

var proxy = http.createServer((req, res) => {
    res.writeHead(200, {"Content-Type": "text/plain"});
    res.end("Hello World");
});

proxy.listen(8000);

// Put a friendly message on the terminal
console.log("Server running at http://127.0.0.1:8000/");