var express = require("express"); // This line calls the express module
var app = express(); //invoke express application

var fs = require('fs');

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));


//this will help the app find where to look
app.use(express.static("views"));
app.use(express.static("scripts"));
app.use(express.static("model"));
app.use(express.static("images"));

// Allow access to contact json file
var contact = require("./model/contact.json") 

// route to render index page 
app.get("/", function(req, res){
   
    res.render("index.ejs");
    console.log("The index page!")
    
});

// route to render about page 
app.get("/about", function(req, res){
  
    res.render("about.ejs");
    console.log("The about page!")
    
});

// route to render contact info page 
app.get("/contact", function(req, res){
    res.render("contact.ejs", {contact});
    console.log("The contact page!")
    
});

//route to render to the newletter page
app.get("/newsletter", function(req, res){
    res.render("newsletter.ejs");
    console.log("The newsletter page!")
    
});

// route to render to the add contact page 
app.get("/addcontact", function(req, res){
    res.render("addcontact.ejs");
    console.log("The addcontact page!")
    
});

// route to render contact info page 
app.post("/addcontact", function(req, res){
    
    // function to find the max id
  	function getMax(contacts , id) {
		var max
		for (var i=0; i<contacts.length; i++) {
			if(!max || parseInt(contact[i][id]) > parseInt(max[id]))
				max = contacts[i];
			
		}
		return max;
	}
	
	
	var maxPpg = getMax(contact, "id"); // This calls the function above and passes the result as a variable called maxPpg.
	newId = maxPpg.id + 1;  // this creates a nwe variable called newID which is the max Id + 1
	console.log(newId); // We console log the new id for show reasons only
    
	// create a new contact based on what we have in our form on the add page 
	var contactsx = {
    name: req.body.name,
    id: newId,
    Comment: req.body.comment,
    email: req.body.email
    
  };
    
     console.log(contactsx);
  var json = JSON.stringify(contact); // Convert our json data to a string
  
  // The following function reads the new data and pushes it into our JSON file
  fs.readFile('./model/contact.json', 'utf8', function readFileCallback(err, data){
    if(err){
     throw(err);
         
    } 
    else {
      contact.push(contactsx); // add the data to the json file based on the declared variable above
      json = JSON.stringify(contact, null, 4); // converts the data to a json file and the null and 4 represent how it is structuere. 4 is indententation 
      fs.writeFile('./model/contact.json', json, 'utf8')
    }
    
  })
  res.redirect("/contact");
});


app.get("/editcontact/:id", function(req, res){
   function chooseContact(indOne){
   return indOne.id === parseInt(req.params.id)
     }
 
  var indOne = contact.filter(chooseContact);
  res.render("editcontact.ejs", {indOne});
});


// Create post request to edit the individual review
app.post('/editcontact/:id', function(req, res){
 var json = JSON.stringify(contact);
 var keyToFind = parseInt(req.params.id); // Id passed through the url
  var index = contact.map(function(contact) {return contact.id;}).indexOf(keyToFind)
 

 contact.splice(index, 1, {name: req.body.name, Comment: req.body.comment, id: parseInt(req.params.id), email: req.body.email});
 json = JSON.stringify(contact, null, 4);
 fs.writeFile('./model/contact.json', json, 'utf8'); // Write the file back
 res.redirect("/contact");
});
// end post request to edit the individual review

// url to delete JSON
app.get("/deletecontact/:id", function(req, res){
    
  var json = JSON.stringify(contact); // Convert our json data to a string
  
  var keyToFind = parseInt(req.params.id) // Getes the id from the URL
  var data = contact; // Tell the application what the data is
  var index = data.map(function(d) {return d.id;}).indexOf(keyToFind)
  console.log("variable Index is : " + index)
  console.log("The Key you ar looking for is : " + keyToFind);
  
  contact.splice(index, 1);
  json = JSON.stringify(contact, null, 4); // converts the data to a json file and the null and 4 represent how it is structuere. 4 is indententation 
      fs.writeFile('./model/contact.json', json, 'utf8')
  res.redirect("/contact");
    
});

app.post('/add', function(req, res){
	var count = Object.keys(contact).length; // Tells us how many products we have its not needed but is nice to show how we can do this
	console.log(count);
	
	// This will look for the current largest id in the reviews JSON file this is only needed if you want the reviews to have an auto ID which is a good idea 
	
	function getMax(contacts , id) {
		var max
		for (var i=0; i<contacts.length; i++) {
			if(!max || parseInt(contact[i][id]) > parseInt(max[id]))
				max = contacts[i];
			
		}
		return max;
	}
	
	var maxPpg = getMax(contact, "id"); // This calls the function above and passes the result as a variable called maxPpg.
	newId = maxPpg.id + 1;  // this creates a nwe variable called newID which is the max Id + 1
	console.log(newId); // We console log the new id for show reasons only
	
	// create a new contact based on what we have in our form on the add page 
	
	var contactsx = {
    name: req.body.name,
    id: newId,
    Comment: req.body.comment,
    email: req.body.email
    
  };
  
  console.log(contactsx);
  var json = JSON.stringify(contact); // Convert our json data to a string
  
  // The following function reads the new data and pushes it into our JSON file
  fs.readFile('./models/contact.json', 'utf8', function readFileCallback(err, data){
    if(err){
     throw(err);
         
    } 
    else {
      contact.push(contactsx); // add the data to the json file based on the declared variable above
      json = JSON.stringify(contact, null, 4); // converts the data to a json file and the null and 4 represent how it is structuere. 4 is indententation 
      fs.writeFile('./models/contact.json', json, 'utf8')
    }
  })
  res.redirect("/contact");
});

// Now we need to tell the application where to run
app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  console.log("Up and running!");
  
})

// ** CODE REFERENCE **
// CLASS NOTES
//W3 Schools