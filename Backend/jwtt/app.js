const cookieParser = require('cookie-parser');
const express = require('express');
const path = require('path');
const app = express();  
app.use(express.json());
app.set("view engine", "ejs");
const path = require('path');

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser());


app.get('/', (req, res) => {
    res.send('Hello World!');
});


app.listen(3000);