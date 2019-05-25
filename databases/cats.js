var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/catdb")

var catSchema = new mongoose.Schema({
    name: String,
    age: Number,
    temperament: String
});

var Cat = mongoose.model("Cat", catSchema);

/* var george = new Cat({
    name: "George",
    age: 12,
    temperament: "grouchy" 
})

george.save(function(err, cat){
    if(err){
    console.log("Something went wrong"+err);
    }
    else{
        console.log("we just saved a cat");
        console.log(cat);
    }
}); */


var newCat = new Cat({
    name: "Jasper",
    age: 28,
    temperament: "Sad"
});

newCat.save(function(err, cat){
    if(err){
        console.log("Something went wrong"+err);
        }
        else{
            console.log("we just saved a cat");
            console.log(cat);
        }
});

Cat.create({
    name: "Snow White",
    age: 15,
    temperament: "Normal"
}, function(err, cat){
    if(err){
        console.log(err);
    }
    else{
        console.log("this is the cat _----------")
        console.log(cat);
    }
});

Cat.remove({name : "George"}, function(err, cats){
    if(err){
        console.log(err);
    }
    else{
        console.log("Deleted!");
    }
});

//retrieve all cats
Cat.find({}, function(err, cats){
    if(err){
        console.log("OH NO, ERROR!")
        console.log.og(err);
    }
    else{
        console.log("ALL THE CATS...");
        console.log(cats);
    }
})