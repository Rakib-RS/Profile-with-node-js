var express = require('express');
var mongodb = require('mongodb');
var bodyParser = require('body-parser');
var ObjectID = mongodb.ObjectID;
const COLLECTION = "contacts";
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
var distDir = __dirname + "/dist/";
app.use(express.static(distDir));

var db;
//const url = "mongodb://localhost:27017/test";
const url = "mongodb+srv://rakib:rakib@cluster0-0bgt6.mongodb.net/Profile?retryWrites=true&w=majority";
mongodb.MongoClient.connect(process.env.MONGODB_URI ||url,{useNewUrlParser:true,useUnifiedTopology:true},function(err,client){
    if (err) {
        console.log(err);
        process.exit(1);
    }
    db = client.db();
    console.log("database Connection ready");
    var server = app.listen(process.env.PORT || 8080,function(){
        var port = server.address().port;
        console.log("app now running on port ",port);
        
    })
    
});
// CONTACTS API ROUTES BELOW

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
    console.log("ERROR: " + reason);
    res.status(code || 500).json({"error": message});
  }
  
  /*  "/api/contacts"
   *    GET: finds all contacts
   *    POST: creates a new contact
   */
  
  app.get("/api/contacts", function(req, res) {
    db.collection(COLLECTION).find({}).toArray(function(err,docs){
        if (err) {
            handleError(res,err.message,"Failed to get contacts");
        }
        else{
            res.status(200).json(docs);
        }
    })
  });
  
  app.post("/api/contacts", function(req, res) {
      console.log(req.body);
      
    var newContact = req.body;
    newContact.createDate = new Date();
  
    if (!req.body.name) {
      handleError(res, "Invalid user input", "Must provide a name.", 400);
    } else {
      db.collection(COLLECTION).insertOne(newContact, function(err, doc) {
        if (err) {
          handleError(res, err.message, "Failed to create new contact.");
        } else {
          res.status(201).json(doc.ops[0]);
        }
      });
    }
  });
  
  /*  "/api/contacts/:id"
   *    GET: find contact by id
   *    PUT: update contact by id
   *    DELETE: deletes contact by id
   */
  
  app.get("/api/contacts/:id", function(req, res) {
    db.collection(COLLECTION).findOne({_id:new ObjectID(req.params.id)},(err,doc)=>{
      if (err) {
        handleError(res,err.message,"failed t connect");
      }
      else{
        res.status(200).json(doc);
      }
    })
  });
  
  app.put("/api/contacts/:id", function(req, res) {
    var updateDoc = {$set :req.body};
    //var updateDoc = req.body;
    //delete updateDoc._id;
    db.collection(COLLECTION).updateOne({ _id: new ObjectID(req.params.id) },
    updateDoc,
    { upsert: true },(err,doc)=>{
      if (err) {
        handleError(res,err.message,"failed to upadate contact");
      }
      else{
        //updateDoc._id = req.params.id;
        updateDoc = req.body;
        updateDoc._id = req.params.id;
        res.status(200).json(updateDoc);
      }
    })
  });
  
  app.delete("/api/contacts/:id", function(req, res) {
    db.collection(COLLECTION).deleteOne({_id: new ObjectID(req.params.id)},function(err,doc){
      if (err) {
        handleError(res,err.message,"Failed to delete contact");

      }
      else{
        res.status(200).json(req.params.id);
      }
    })
  });