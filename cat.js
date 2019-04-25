var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/cat_app", {useNewUrlParser: true});
var catSchema = new mongoose.Schema({
    name:String,
    age:Number,
    temperament: String
});
//take the cat schema and compile it into a model which returns an object that has a bunch of methods like create and find..
var Cat = mongoose.model("Cat", catSchema);// compiled our schema to a model and saved it to a variable called cat
//mongoose is a object data mapper so its a way for us to write javascript code to interact with the database
// var lebron = new Cat({
//     name:"DWADE",
//     age: 12,
//     temperament: "evil"
// })

// lebron.save(function(err, cat){//calling the function once  lebron has actually been saved , callback function
//     if(err){
//         console.log("error")
//     }else{
//         console.log("we saved a cat");
//         console.log(cat);
//     }
// })

Cat.find({}, function(err, cats){//call back is called once the cat is found in the database
    if(err){
        console.log(err);
    }else{
        console.log(cats);
    }
})
Cat.create({
    name: "kyrie",
    age : 14,
    temperament: "nice"
}, function(err,cat){
    if(!err){
        console.log(cat);
    }
});//to see if the cat was created we add in a callback which tells us