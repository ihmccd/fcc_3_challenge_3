var express = require("express");
var bodyParser = require("body-parser");
var mongoClient = require("mongodb").MongoClient;
var objectId = require("mongodb").ObjectID;
var PORT = process.env.PORT || 3000 

var app = express();
var jsonParser = bodyParser.json();
var url = "mongodb://anyone:1111@ds119250.mlab.com:19250/urls";
 
app.use(express.static(__dirname + "/public"));
app.get("/", function(req, res){
	res.send("please, enter url");      

});

/*app.get("/restart", function(req, res){
	mongoClient.connect(url, function(err, db){
	if(err) return res.status(400).send();
	db.collection("urls").drop(function(err,result){
		res.send("everything's deleted");
		db.close();  
	});
});
});

app.get("/show", function(req, res){
	mongoClient.connect(url, function(err, db){
	if(err) return res.status(400).send();
	db.collection("urls").find().toArray(function(err,users){
		res.send(users);
		db.close();
	});
	
});
});*/


app.get("/*", function(req, res){
    
    var userurl = req.params[0];

    if (Number(userurl)){

    mongoClient.connect(url, function(err, db){
    		if(err) return res.status(400).send();
    		db.collection("urls").findOne({short_url: String(userurl)}, function(err, user){

    			if(err) return res.status(400).send();
    			if (user){
    				res.redirect(user['original_url']);
    				db.close();
    			}
    			else{
    				res.send({'error': 'url not in database'});
    				db.close();
    			}

    		})
    	});
        }
        else {
        	var regex = new RegExp('https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}');
        	if (userurl.match(regex)){
		        	mongoClient.connect(url, function(err, db){
		    		if(err) return res.status(400).send();
		    		db.collection("urls").findOne({original_url: String(userurl)}, function(err, user){

		    			if(err) return res.status(400).send();
		    			if (user){
		    				res.send(user);
		    				db.close();
		    			}
		    			else{
					    		db.collection("urls").count(function (err,result){
			        			db.collection("urls").insertOne({original_url: String(userurl), short_url:String(result+1)}, function(err, results){
			        			if(err) return res.status(400).send();
			        			db.collection("urls").findOne({original_url: String(userurl)}, function(err, user){
			        			if(err) return res.status(400).send();
			        			res.send(user);
			        			db.close();
			        			})
			         			});
			        		})
		    			}

		    		})
		    	});
        	}
        	else{
 
        		res.send({error: 'invalid url',
        				 'url examples supported': ['http://www.something.gr', 'https://www.something.gr', 'http://something.gr', 'http://www.something.gr/something', 'http://www.s.co', 'http://something.gr']});

        	}        		
    	};
        });


 
app.listen(PORT);