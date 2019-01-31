var bodyParser = require('body-parser');
var express = require('express');
var app = express();
//create application/x-www-form-urlencoded
var urlencodedParser = bodyParser.urlencoded({extended:false});

//parse application/json
var jsonParser = bodyParser.json();

// Usuarios
var u1 = {username:"marcbryan", password:1234};
var u2 = {username:"prueba", password:"prueba"};
var u3 = {username:"root", password:"root"};


var users = {
  marc:"1234",
  prueba:"4567"
};

app.set('view engine', 'ejs');

// POST /login gets urlencoded bodies
app.post('/login', urlencodedParser, function(req, res) {
  // if (req.body.username == 'marcbryan'){
  //   console.log('hola');
  // }
  if(!req.body) return res.sendStatus(400);
  res.send('Welcome ' + req.body.username);
});

app.get('/login', function (req, res) {
  res.render("login");
});

// POST /api/users gets urlencoded bodies
app.post('/api/users', jsonParser, function (req, res) {
  req.body = {username:marcbryan};
  if (!req.body)
    return res.sendStatus(400);
});

//Ruta '/' -> muestra la plantilla login.ejs (un input y un botón de submit)
app.get('/', function (req, res) {
  res.setHeader('Content-Type', 'text/plain');
  //res.render("login");
  res.write('You posted:\n');
  res.end(JSON.stringify(req.body, null, 2));
});

app.post('/', function (req, res) {
  res.send("Recibido!");
});

//Ruta '/hola' -> muestra el contenido de la plantilla index.ejs
app.get('/hola', function (req, res){
  var user = {name:"Marc", id:1, nick:"marcbryan"};
  res.render("index", {user:user});
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
