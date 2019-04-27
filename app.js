var express = require("express");
var app = express();
var bodyParser = require("body-parser");//You need to use bodyParser() if you want the form data to be available in req.body.
var mongoose = require('mongoose');
var request = require("request");
var basketballArray;
var tempArray;
var searchMade = false;
request('https://www.fantasybasketballnerd.com/service/players',function(error,response,body){
    if(error){
        console.log(error);//checking if there is an error
    }else{
        if(response.statusCode == 200){
          //checking if response was correct, if it was 404 then u would get a page not found
            //console.log(body);//since response was correct, body is all the data contained.
            //to retrive data from the body of an API , we need to parse it into a JSON, as of now the body is just a string
            var parseString = require('xml2js').parseString;
            var jsonversion;
            console.log(typeof body);
            parseString(body, function (err, result) {//body was in xml and now is in json
                jsonversion = JSON.stringify(result);
            });
            //to convert from string to JSON
            console.log(typeof body);
            //console.log(jsonversion);
            var parsedData = JSON.parse(jsonversion);
            console.log(typeof parsedData);
            basketballArray = parsedData["FantasyBasketballNerd"]["Player"];
        }
    }
});

let schema = new mongoose.Schema({
    name: String,
});

mongoose.connect("mongodb://localhost/fav_player", {useNewUrlParser: true});

var FavoritePlayer = mongoose.model("favoritePlayer", schema);

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs"); //now we dont gotta write landing.ejs
app.get("/",function(req,res){
    res.render("landing");
})
var count = 0;
var fav;
app.get("/campgrounds", function(req,res){
        FavoritePlayer.find({}, function(err, favPlayer){
            if(err){
                console.log(err);
            }else{
                fav = favPlayer;
            }
        })
        if(searchMade==false){
            res.render("campgrounds", {basketballArray:basketballArray, favoritePlayer:fav});
        }else{
            res.render("campgrounds", {basketballArray:tempArray, favoritePlayer:fav});
        }
})
app.get("/campgrounds/new", function(req,res){
    res.render("search.ejs");
});
app.get("/campgrounds/:id", function(req,res){
    var param = req.params.id;
    res.render("show", {player:basketballArray[param]});
});
//how to get input from routes?
app.get("/searchPlayer/:name",function(req,res){
    res.render(req.params.name);
});
app.get("/favplayer/:id",function(req,res){
    var param = req.params.id;
    var favPlayer = {name:param};
    FavoritePlayer.create(favPlayer, function(err, newlyCreated){
        if(err){
            console.log(err);
        }else{
            console.log(newlyCreated);
        }
    })
    res.render("campgrounds", {basketballArray:basketballArray, favoritePlayer:param} );
})
app.post("/campgrounds",function(req,res){
    var search = req.body.searchField;
    if(search!=""){
        var searchWithQuote = search.charAt(0).toUpperCase() + search.slice(1);
        console.log(searchWithQuote);
        tempArray=[];
        var count =0;
        var len = search.length;
        for(var i = 0; i < basketballArray.length; i++){
            var stringVersion = JSON.stringify(basketballArray[i].name);
            console.log(stringVersion);
            if(stringVersion.substring(2,2+len) == searchWithQuote){
                tempArray[count++] = basketballArray[i];
            }
        }
        searchMade = true;
    }else{
        searchMade = false;
    }
    res.redirect("/campgrounds");
})
app.listen(3000, function(){
    console.log("yelpcampworking");
});