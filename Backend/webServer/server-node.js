const http = require('http');

const hostname = '127.0.0.1';

const port = 3000;

const server = http.createServer((req , res) => {
    if (req.url === '/') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain')
        res.end("Hello ice tea")
    } else if (req.url === '/ice-tea') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain')
        res.end("thanks for ordering ice tea, we will deliver it to you soon")
    }else {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain')
        res.end("404 Not Found")
    }
})

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
})