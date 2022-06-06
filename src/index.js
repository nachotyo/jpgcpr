// Requiere express, ejs-mate, path y morgan
const express = require('express');
const engine =  require('ejs-mate');
const path = require('path');
const morgan = require('morgan');
const passport = require('passport');
const sesion = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');

// Inicializamos
// Ejecutamos express (devuelve un app)
const app = express();
require('./database');
require('./passport/local-auth');

// Configuramos el ejs-mate
// Le decimos en que carpeta van a estar las vistas
app.set('views', path.join(__dirname, 'views'));
// Van a ser de tipo ejs
app.engine('ejs', engine);
app.set('view engine', 'ejs');

// Configuramos el puerto que utilizaremos, le decimos que utilice el puerto del sistema operativo o el 3000
app.set('port', process.env.PORT || 3000);

//middlewares (funciones que se ejecutan antes de las rutas)
// Nos muestra un mensaje por consola
app.use(morgan('dev'));
// Seleccionamos la carpeta donde guardaremos todas las fotos
app.use(express.static(__dirname + '/views/imagenes'));
app.use(express.static(__dirname + '/views/css_propio'));
app.use(express.static(__dirname + '/views/js'));

// Nos permite obtener los datos de un usuario, extended: false significa que no vamos a recibir archivos muy pesados como imagenes o videos
app.use(express.urlencoded({extended: false}));
// Guardamos en sesión los datos del usuario conectado
app.use(sesion({
    secret: 'mysesionsecreta',
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));

app.use((req, res, next) => {
    // Guardamos el objeto flash y lo guardamos en los objetos locales
    app.locals.msgRegistrarse = req.flash('msgRegistrarse');
    app.locals.msgIniciarSesion = req.flash('msgIniciarSesion');
    app.locals.user = req.user;
    next();
});

// Rutas
// Le decimos a donde se tiene que dirigir si buscamos '/'
app.use('/', require('./routes/index'));

// Lanzamos el servidor y escribimos por consola en el puerto donde esta alojado
app.listen(app.get('port'), () => {
    console.log('Servidor en el puerto ', app.get('port'));
}
);
