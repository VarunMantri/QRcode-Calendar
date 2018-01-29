var express = require('express');
var morgan=require('morgan');
var organiserRouter=require('./routes/organiserRouter.js');
var config=require("./config.js");

var app=express();

var session = require('express-session');
app.use(express.static(__dirname));
app.use(session({
    secret: '2C44-4D44-WppQ38S',
    resave: true,
    saveUninitialized: true
}));

app.use(morgan('dev'));
app.use("/",organiserRouter);


app.listen(config.port,config.hostname,function()
{
   console.log("Server running on http://"+config.hostname+":"+config.port); 
});