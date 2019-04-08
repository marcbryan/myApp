var bodyParser = require('body-parser');
var express = require('express');
var app = express();
//create application/x-www-form-urlencoded
var urlencodedParser = bodyParser.urlencoded({extended:false});

//parse application/json
var jsonParser = bodyParser.json();

// Un diccionario de Usuarios (clave:valor)
var users = {
  marc:"1234",
  prueba:"4567",
  root:"root"
};

var c = 0;

app.set('view engine', 'ejs');

const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

app.get('/db', async (req, res) => {
  res.render("db");
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM usuarios');
      //console.log('Result: '+result);
      //console.log('Users -> '+users);
      const results = { 'results': (result) ? result.rows : null};
      console.log(results);
      var user = JSON.parse(results);
      console.log('Users -> '+user);
      //res.render('pages/db', results );
      client.release();//*/
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
});

// POST /login gets urlencoded bodies
app.post('/login', urlencodedParser, function(req, res) {

  if ((req.body.username == "") | (req.body.contra == "")) {
     res.send('Faltan campos por rellenar');
  } else {
    for (user in users) {
      if (req.body.username == user & req.body.contra == users[user]) {
        res.send('Has hecho login con el usuario ' + req.body.username);
        c = 1;
        return;
      }
    }
    if (c == 0) {
      res.send('Credenciales incorrectas');
    }
  }
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
/*
app.get('/login/:user/:password', function (req, res) {
  res.send(req.params.user+" "+req.params.password);
});*/

app.get('/login/:user/:password', function (req, res) {
  for (user in users) {
    if (req.params.user == user & req.params.password == users[user]) {
      var status = {"status":"OK"};
      res.send(JSON.stringify(status));
      return;
    }
  }
  var status = {};
  status = "ERROR";
  res.send(JSON.stringify(status));
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

app.listen(process.env.PORT, function () {
  console.log('Aplicación Heroku!')
  //console.log('Example app listening on port 3000!');
});
