var bodyParser = require('body-parser');
var express = require('express');
var app = express();
//create application/x-www-form-urlencoded
var urlencodedParser = bodyParser.urlencoded({extended:false});

//parse application/json
var jsonParser = bodyParser.json();

//CORS (para solucionar el error “No Access-Control-Allow-Origin header”)
var cors = require('cors');
app.use(cors());

// Un diccionario de Usuarios (clave:valor)
var users = {
  marc:"1234",
  prueba:"4567",
  root:"root"
};

app.set('view engine', 'ejs');

const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

// Prueba consultas Postgresql
app.get('/db', async (req, res) => {
  res.render("db");
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM usuarios');
      const results = { 'results': (result) ? result.rows : null};

      var users = results['results'];
      for (user in users) {
        var usuario = users[user];
        console.log('nombre: '+usuario.username+', pass:'+usuario.password);
      }
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
});

// POST /login gets urlencoded bodies
app.post('/login', urlencodedParser, function(req, res) {
  var c = 0;
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

app.get('/login/:user/:password', async (req, res) => {//function (req, res) {
  /*
  // Busca los usuarios en la variable 'users'
  for (user in users) {
    if (req.params.user == user & req.params.password == users[user]) {
      var status = {"status":"OK"};
      res.send(JSON.stringify(status));
      return;
    }
  }
  var status = {"status":"ERROR"};
  res.send(JSON.stringify(status));*/

  var loginOK = false;
  // Buscar los usuarios en la base de datos PostgreSQL de Heroku
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM usuarios');
    const results = { 'results': (result) ? result.rows : null};
    // Guardo los usuarios en esta variable
    var users = results['results'];
    for (user in users) {
      var usuario = users[user];
      // Comprobamos si el nombre de usuario y la contraseña concuerdan con el introducido
      if (req.params.user == usuario.username & req.params.password == usuario.password) {
        loginOK = true;
        var status = {"status":"OK"};
        res.send(JSON.stringify(status));
        return;
      }
    }
    if (!loginOK){
      var status = {"status":"ERROR"};
      res.send(JSON.stringify(status));
    }
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

app.post('/login/:user/:password', function (req, res) { //async (req, res) => {
  console.log(JSON.stringify(req.body));
  res.send(JSON.stringify(req.body));
  //res.send(status);
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
  console.log('Aplicación Heroku funcionando correctamente!');
});
