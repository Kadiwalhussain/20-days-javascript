import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import userModel from './models/user.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.get('/', (res) => {
    res.render("index");
});

app.get('/read', (res) => {
    res.render("read");
});

app.get('/read', (req, res) =>{
    res.render("read");
})

app.post('/create', async (req, res) => {
    let {name, email, image} = req.body;

    let createdUser = await userModel.create({
        name,
        email,
        image
    });

    res.send(createdUser);
});
    

app.listen(3000);