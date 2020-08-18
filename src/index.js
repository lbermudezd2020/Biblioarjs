//inicializar 
const express = require('express'); //framework backend 
const morgan = require('morgan');//moudlo que permite mostrar las peticiones http (Consola)
const path = require('path');
const exphbs = require('express-handlebars');//motor de plantillas .hbs
const session = require('express-session'); //guardar session 
const validator = require('express-validator');//validar datos del usuario
const passport = require('passport');//metodos de authenticacion local
const flash = require('connect-flash');//mostrar mensajes de error y exito cuando se realice una operacion
const MySQLStore = require('express-mysql-session')(session);//guardar las sesiones dentro de l bd
const bodyParser = require('body-parser');

const https = require('https');
const fs = require('fs');


const { database } = require('./keys');

// Intializations
const app = express(); //se ejecuta y se alamcena en un objeto app
require('./lib/passport');

// configuracioon servidor 
const PORT = 4000;
//app.set('port', process.env.PORT || 4000); //definir un puerto


app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({ //vamos a utilizar plantilla hbs
  defaultLayout: 'main',
  layoutsDir: path.join(app.get('views'), 'layouts'),
  partialsDir: path.join(app.get('views'), 'partials'),
  extname: '.hbs',
  helpers: require('./lib/handlebars')
}))

app.set('view engine', '.hbs');


// Se ejecutan
app.use(morgan('dev')); //mensaje por consola
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(session({
  secret: 'nodemysql',
  resave: false,
  saveUninitialized: false,
  store: new MySQLStore(database)
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(validator());

// Global variables
app.use((req, res, next) => {
  app.locals.message = req.flash('message');
  app.locals.success = req.flash('success');
  app.locals.user = req.user;
  next();
});

// Routes
app.use(require('./routes/index'));
app.use(require('./routes/authentication'));
app.use('/links', require('./routes/links'));

// Public
app.use(express.static(path.join(__dirname, 'public')));

// Starting


/*
app.listen(app.get('port'), () => {
  console.log('El servidor esta en el puerto', app.get('port'));
});
*/
https.createServer({
  key: fs.readFileSync(path.join(__dirname, 'cert', 'apache.key')),
  cert: fs.readFileSync(path.join(__dirname, 'cert', 'apache.crt'))
}, app).listen(PORT, function(){
  console.log("My https server listening on port " + PORT + "...");
});
