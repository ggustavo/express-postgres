
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database');
const gen = require('./generator-pages');
const crud = require('./abstract-crud');
const app = express();
const PORT = 3000;

/* ----------------Config Express-------------------- */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));

app.listen(PORT, function () {
  console.log('Server Start. Port: ' + PORT);
});

/* ----------------Config Tables-------------------- */
const table = {
  name: 'user',
  columns: ['id', 'name', 'email', 'password'],
  primary_key: 'id'
}

/* ----------------Config Routers-------------------- */
app.use('/user', crud(db,table,true));  //true > use jade views

/* ----------------Pages Generator------------------------ */
gen.path("/views");
gen.nav(["/user"]);
gen.pages([table]);

/* ----------------Extras------------------------ */
app.get('/', function (req, res) { //test get
  res.render('index',{ title : 'Home' });
});
app.post('/msg', function (req, res) { //test post
  console.log('-> ' + JSON.stringify(req.body));
  console.log('-> ' + req.body.name);
  res.send('Got a POST request');
});