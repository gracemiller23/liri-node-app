require("dotenv").config();

var keys = require('./keys.js');
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var request = require("request");
var fs = require("fs");


var spotify = new Spotify(keys.spotify);

var client = new Twitter(keys.twitter);

var command = process.argv[2];

var searchThis="";

searchTerm();

/////// determines and enacts appropriate function based on user command /////
if(command === "do-what-it-says"){
    fs.readFile("random.txt", "utf8", function(err, data) {
       
        if (err) {
          return console.log(err);
        }
       var commandArray = data.split(",");
        
       command = commandArray[0];
       searchThis = commandArray[1];
       console.log(command);
       console.log(searchThis);
        justDoIt();

    });
 
}
    
if (command === "my-tweets"){
        showTweets();
    }else if(command === "spotify-this-song"){
        loveThatSong();
    }else if(command === "movie-this"){
        movieInfo();
    };


///////// functions for user commands ///////////

function showTweets(){
    //displays most recent 20 tweets and when they were created
    client.get("statuses/user_timeline", {screen_name: "gmthedeveloper", count: 20}, function(error, tweets, response) {
        if(error){ console.log(error);
        }else{
            if(tweets.length >= 20){
                console.log("_____________________________________________________________")
                for (var i = 0; i<20; i++){
                console.log("<3 Grace tweeted '" + tweets[i].text + "' on " + tweets[i].created_at);  // When it was tweeted
                console.log("_____________________________________________________________")
            }
            }else{
                console.log("_____________________________________________________________")
                for (var i = 0; i<tweets.length; i++){
                console.log("<3 Grace tweeted '" + tweets[i].text + "' on " + tweets[i].created_at);  // When it was tweeted
                 }
                console.log("_____________________________________________________________")

            }
        }
    });
};

//////not returning data
function loveThatSong(){
    //display artist(s), song's name, a preview link of the song, and the song's album from Spotify
    if (searchThis === "" || searchThis === ""){
        searchThis = "The Sign";

    }else{
        
    

    spotify.search({ type: 'track', query: searchThis }).then(function(response) {

    console.log("_____________________________________________________________")  

    console.log("Artist(s): " + response.tracks.items[0].album.artists[0].name);
    console.log("Song: " + response.tracks.items[0].name);
    console.log("Album: " + response.tracks.items[0].album.name);
    console.log("Preview Link: " + response.tracks.items[0].external_urls.spotify);

    console.log("_____________________________________________________________")  


  })
}
}


function movieInfo(){
    //display movie information from OMDB
    if (searchThis === "" || searchThis === ""){
        //If no song is provided then your program will default to "Mr.Nobody".
        searchThis = "Mr. Nobody";
    }else{
        
    
    
        var queryURL= "http://www.omdbapi.com/?t=" + searchThis + "&y=&plot=short&apikey=trilogy";
        console.log(queryURL);
        request(queryURL, function(error, response, body){
            if (!error && response.statusCode === 200) {
                var movieInfo= JSON.parse(body);
            
                console.log("_____________________________________________________________")
                console.log("*Title: " + movieInfo.Title);
                console.log("*Released: " + movieInfo.Year);
                console.log("*IMDB Rating: " + movieInfo.imdbRating);
                // console.log("*Rotten Tomatoes Rating: " + movieInfo.Ratings[1].Value);
                console.log("*Produced in: " + movieInfo.Country);
                console.log("*Language: " + movieInfo.Language);
                console.log("*Plot: " + movieInfo.Plot);
                console.log("*Actors: " + movieInfo.Actors);
                console.log("_____________________________________________________________")

            }else{
                console.log(error);
            }
        })
    }
}


function justDoIt(searchThis){
    searchThis = searchThis;
   
    if (command === "my-tweets"){
        showTweets();
    }else if(command === "spotify-this-song"){
        loveThatSong();
    }else if(command === "movie-this"){
        movieInfo();
    }else if(command === "do-what-it-says"){
        console.log("I only take orders from the boss.")
    }
  


}



function searchTerm(){
    for (var i=3; i < process.argv.length; i++ ){
        searchThis = searchThis + " " + process.argv[i];
    };
    return searchThis;
}



