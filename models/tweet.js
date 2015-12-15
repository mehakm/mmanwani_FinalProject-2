var mongoClient = require('mongodb').MongoClient;
var Twitter = require('twitter');
var sentiment=require('sentiment-analysis');
var emotion = require('emoji-emotion');
var senti = require('senti');
var analyze = require('Sentimental').analyze,
    positivity = require('Sentimental').positivity,
    negativity = require('Sentimental').negativity;



var client = new Twitter({
  consumer_key: 'ybsGAJ49aS0LRT9hq7hHybp0R',
  consumer_secret: 'iR0MvbaJF50HRK2v1PfzfZM20Ren5abJQDyBkDvHpQKjrNGH8M',
  access_token_key: '4204445519-6hURmHK2p3vwCwNKZH4lbz0Ad4TJnnKZHapKCdr',
  access_token_secret: '1tthV8AvL7Y7LECkG9ltMiZ8LoNzpWZFrcG53HOYf0SE8'
});

/*
 * This connection_string is for mongodb running locally.
 * Change nameOfMyDb to reflect the name you want for your database
 */
var connection_string = 'localhost:27017/tweet_collection';
/*
 * If OPENSHIFT env variables have values, then this app must be running on 
 * OPENSHIFT.  Therefore use the connection info in the OPENSHIFT environment
 * variables to replace the connection_string.
 */
if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
  connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
  process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
  process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
  process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
  process.env.OPENSHIFT_APP_NAME;
}
// Global variable of the connected database
var mongoDB; 

// Use connect method to connect to the MongoDB server
mongoClient.connect('mongodb://'+connection_string, function(err, db) {
  if (err) doError(err);
  console.log("Connected to MongoDB server at: "+connection_string);
  mongoDB = db; // Make reference to db globally available.
});



exports.requestTweets = function(search_query, callback){

	var params={q:search_query};
	var result=[];

	client.get('search/tweets',params, function(error, tweets, response){
	  	if (!error) {


			    for(var i = 0; i < tweets.statuses.length; i++){

			    	console.log(tweets.statuses[i].text);
			    	var message=(tweets.statuses[i].text);
			    	var analysis=analyze(message);
			    	var emoji=emotion[analysis];
			    	console.log(analysis);
			    	senti(message,function(r){
			    		console.log(r);
			    	});
			    	var pos=positivity(message);
			    	var neg=negativity(message);
			    	result.push({tweet:message,analysis_score:analysis.score,positivity:pos.score,positive_words:pos.words,negativity:neg.score,negative_words:neg.words});

			    	mongoDB.collection("tweet_collection").insertOne(
				    {tweet: tweets.statuses[i].text, keyword: search_query},             // the object to be inserted
				    function(err, status) {   // callback upon completion
					      if (err) doError(err);
					      console.log("5. Done with mongo insert operation in mongoModel");
					      // use the callback function supplied by the controller to pass
					      // back true if successful else false
					      console.log("6. Done with insert operation callback in mongoModel");
					    });
					  console.log("7. Done with insert function in mongoModel");
				}

	 	}
	 	callback(JSON.stringify(result));

	});

	//callback();
	
}


exports.getTweets = function(callback){

	mongoDB.collection("tweet_collection").find().toArray(function(err, docs) {
		console.log(docs);

    if (err) doError(err);
    // docs are MongoDB documents, returned as an array of JavaScript objects
    // Use the callback provided by the controller to send back the docs.
    callback( JSON.stringify(docs) );
  });
}
 


