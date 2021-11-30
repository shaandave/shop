const express = require('express');
global.dotenv = require('dotenv').config();
const db = require('./config/database');
const bodyParser = require('body-parser');
const checkJwtAuthentication  = require('./middleware/authMiddleware');

const user = require('./routes/user');
const product = require('./routes/product');

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


// Custom routers 
app.use('/user', user);
//app.use('/category', category);
app.use('/product', checkJwtAuthentication, product);

global.db = db;

app.listen(3333, (err) => {
    if(err) console.log("Check Server Connection!!")
    console.log("Linten On Port 3333");
    db.connect((err) => {
        if(err) throw err;
        console.log("Connected To Database!!!!");
    });
})