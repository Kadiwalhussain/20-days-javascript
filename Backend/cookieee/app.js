const express = require('express'); 
const cookieParser = require('cookie-parser');  

const app = express();
const port =3000;

app.use(cookieParser("Hussain secret-key"));


app.get('/set-signed-value', (req, res) => {
    res.cookie('signedCookie', 'somevalue', { signed: true });
    res.send('Signed cookie set');
});


app.get('/read-signed-cookie', (req, res) => {
    if(req.signedCookie.signedCookie) {
        res.send(`Signed cookie value: ${req.signedCookie.signedCookie}`);
    } else {
        res.send("No signed cookie found");
    }
});

app.get('/set-json-cookie', (req, res) => {
    const jsonCookie = { name: 'Alice', age: 25 };
    res.cookie('jsonCookie', jsonCookie, { json: true });
    res.send('JSON cookie has been set!');
});






app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
