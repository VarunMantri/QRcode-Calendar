var express=require("express");
var MongoClient=require("mongodb").MongoClient;
var organiserRouter=express.Router();
var config=require("../config.js");

var bodyparser=require("body-parser");

organiserRouter.use(bodyparser.json());

var auth = function(req, res, next) {
    if(req.session.user==null)
    { 
        //This code will be executed when user not logged in
        //res.redirect(/login);
        //redirect        
    }
    else
    {
        // This code is executed if user is logged in
        console.log(req.session);    
    }
    next();
};


//REST end point: all movies
//client rest end points
organiserRouter.route("/client/:eventID/:organiserID")
.get(function(req,res,next)
{
    console.log("Testing");
    MongoClient.connect(config.url,function(err,database){
            if(err)
            {
                console.log("Unable to retrive db object.")   
            }
            else
            {
                console.log("testing");
                const myAwesomeDB = database.db('qrCalendar')
                var collection=myAwesomeDB.collection("Events");
                collection.find({eventName:{$eq:req.params.eventID},organiserName:{$eq:req.params.organiserID}}).toArray(function(err,docs)
                {
                    var temp=[];
                    docs.forEach(function(item)
                    {
                        temp.push({'loaction':item.eventLocation,'time':item.eventTime});
                    });
                    res.json(temp);
                    console.log("request completed");
                });
            }
        });
   
});


organiserRouter.route("/organiser")
.post(auth,function(req,res,next){
     MongoClient.connect(config.url,function(err,database){
            if(err)
            {
                console.log("Unable to retrive db object.")   
            }
            else
            {
                const myAwesomeDB = database.db('qrCalendar');
                console.log(req.body);
                var collection=myAwesomeDB.collection("Events");
                collection.save({organiserName:req.body.organiserName,eventName: req.body.eventName,eventLocation:req.body.eventLocation,startDate:req.body.startDate,startTime:req.body.startTime,endDate:req.body.endDate,endTime:req.body.endTime,email:req.body.email}, function(err,result)
                {
                    res.end("200");
                });
                
            }
        });
    
});


organiserRouter.route("/login/validate")
.post(function(req,res,next){
    MongoClient.connect(config.url,function(err,database){
            const myDB = database.db('qrCalendar');
            var collections=myDB.collection("User");
            var username=req.body.username;
            var password=req.body.password;
            console.log(username);
        console.log(password);
        collections.find({username:{$eq:username},password:{$eq:password}}).toArray(function(err,docs){
            if (docs.length==0)
                {
                    res.end("203");
                }
            else
            {
                req.session.user=username;
                res.end(docs._id);
            }
        });
        });
    
    
});

organiserRouter.route("/register")
.post(function(req,res,next){
    MongoClient.connect(config.url,function(err,database){
            const myDB = database.db('qrCalendar');
            var collections=myDB.collection("User");
            var username=req.body.username;
            var password=req.body.password;
        collections.find({username:{$eq:username}}).toArray(function(err,docs){
            if (docs.length!=0)
            {
                    res.end("204");
            }
            else
            {
                collections.save({username:req.body.username,password:req.body.password,email:req.body.email}, function(err,result)
                {
                    if (err)
                    {
                        console.log("Unable to write user to the data base"); 
                    }
                    else
                    {
                        res.end("200");    
                    }
                    
                    
                });
            }
        });
        });
});


module.exports=organiserRouter;