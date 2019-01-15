var express = require('express');
var bodyParser = require('express');
var mongoose = require('mongoose');
var bodyParser = require('express');

// Lagrar port så att Heroku ska kunna styra den dynamiskt
var port = process.env.PORT || 4000;

// Instans av express
var app = express();


// Body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded( { extended: false }));


// Utan att useFindAndModify är satt till false ges en DeprecationWarning
mongoose.set('useFindAndModify', false);
// Ansluter till databas på mLab med hjälp av användaruppgifter angivna på webbplatsen
mongoose.connect('mongodb://dt162g:mu4tolxa@ds026558.mlab.com:26558/projekt', { useNewUrlParser: true });



// Middleware för att tillåta anslutning från andra domäner
app.all('/*', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
	next();
});



// Importerar schema
const Trophies = require('./trophies.js');

const Login = require('./login.js');



// GET skickar alla trophies 
app.get('/trophies', function(req, res) {

    // Hämtar alla dokument i databasen och skickar tillbaka dem som JSON    
    Trophies.find(function(err, trophies) {
    if(err){
        res.send(err);
    }

    res.json(trophies);
    console.log("Lista skickad");
    });

});



// DELETE tar bort post med valt ID
app.delete('/trophies/delete/:id', function(req, res) {
    let deleteId = req.params.id;
  
    // Skickar ID som objekt till MongoDB med funktionen deleteOne för att ta bort vald kurs
    Trophies.deleteOne({
      _id: deleteId
    }, function(err) {
      if(err) {
        res.send(err);
      }
  
      res.send({ message: "Trophy borttagen"});
      console.log("Trophy med id " + deleteId + " är borttagen");
  
    });
});



// POST lägger till ny kurs
app.post('/trophies/add', function(req, res) {

    // Ny instans av Trophies
    var trophy = new Trophies();
  
    // Nytt objekt med data som fyllts i av användaren
    trophy.name = req.body.name;
    trophy.description = req.body.description;
    trophy.value = req.body.value;
    trophy.date = req.body.date;
    trophy.game = req.body.game;
    trophy.link = req.body.link;
  
    // Lagrar objekt och skriver ut eventuella felmeddelanden
    trophy.save(function(err) {
      if(err) {
        res.send(err);
      }
    })
  
    res.send(trophy);
    console.log("Trophy tillagd")
  
});



// PUT uppdaterar post med valt ID
app.put('/trophies/update/:id', function(req, res) {
  // Anger vilket dokument som ska uppdateras genom id
  let updateId = req.params.id;

  // Ny instans av Trophies
  var trophy = new Trophies();
  
  // Ger värden till medlemsvariabler i instansen av Trophies, både data som inte ska ändars och data som ska ändras
  trophy.name = req.body.name;
  trophy.description = req.body.description;
  trophy.value = req.body.value;
  trophy.date = req.body.date;
  trophy.game = req.body.game;
  trophy.link = req.body.link;


  // Gör anrop till MongoDB-databas och uppdaterar dokument med valt id
  Trophies.findByIdAndUpdate(updateId, { $set: {name: trophy.name, description: trophy.description, value: trophy.value, date: trophy.date, game: trophy.game, link: trophy.link}}, { new: true }, function (err, returnTrophy) {
    if (err) {
      res.send(err);
    }

    // Returnerar det uppdaterade dokumentet
    res.send(returnTrophy);
    console.log("Trophy uppdaterad");
  });
  
});



// Tar emot ett POST-anrop för att kontrollera inloggning
app.post('/login/post', function(req, res) {
  var login = new Login();
  var returnBool = false;
  var loginId = '5c35c170e7179a7d1241d253';

  login.username = req.body.username;
  login.password = req.body.password;

  // Kontrollerar medskickade användarnamn och lösenord mot angivet dokument i databasen
  // Om användarnamn och lösenord stämmer returneras true, annars false
  Login.findById(loginId, function(err, loginCompare) {
    if(err){
      res.send(err);
    }

    if(login.username.toLowerCase() === loginCompare.username.toLowerCase() && login.password === loginCompare.password) {
      returnBool = true;
    }

    res.send(returnBool);
  });

});



// Startar servern
app.listen(port, function() {
    console.log("Servern är startad på port " + port);
});