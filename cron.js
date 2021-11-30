const cron = require('node-cron');
global.dotenv = require('dotenv').config();
const express = require('express');
const db = require('./config/database');
const productController = require('./controllers/productController');
const { Result } = require('express-validator');
app = express();
global.db = db; 


cron.schedule('0 0 0 * * *', function() {
    productController.getAllProducts((err, data) => {
        data.forEach(element => {
            var todaysDate = new Date();
            if(todaysDate > element.expiry_date){ 
                productController.deleteproduct(element.id, (err,res) => {
                    console.log("Deleted product : "+ element.id)
                });
            }
        });
    })
});
  
app.listen(6666, (err) => {
    if(err) console.log("Check Server Connection!!")
    console.log("Cron Linten On Port 6666");
})