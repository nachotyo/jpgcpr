const express = require('express');
const res = require('express/lib/response');
// Objeto donde vamos a guardar las rutas
const router = express.Router();
const passport = require('passport');
const Usuario = require('../models/usuario');
const Contacto = require('../models/contacto');


// Definimos las rutas
// La ruta por defecto
router.get('/', (req, res, next) => {
    // Como respuesta nos dara index
    res.render('index');
});
// Para crear una cuenta, con el metodo get hacemos que le muestre el contenido por pantalla
router.get('/registrarse', (req, res, next) => {
    res.render('registrarse');
});
// con el metodo post enviamos la información al servidor
router.post('/registrarse', passport.authenticate('local-registrarse', {
    // Si se conecta vuelve a la pagina inicial
    successRedirect: '/cuenta',
    // Si falla vuelve a la pagina para registrarse
    failureRedirect: '/registrarse',
    passReqToCallback: true
}));
// Para crear una cuenta
router.get('/iniciarSesion', (req, res, next) => {
    res.render('iniciarSesion');
});

router.post('/iniciarSesion', passport.authenticate('local-iniciarSesion',{
    successRedirect: '/cuenta',
    failureRedirect: '/iniciarSesion',
    passReqToCallback: true
}));

router.get('/cerrarSesion', (req, res, next) => { 
    req.logOut();
    res.redirect('/');
});

router.get('/contacto', (req, res, next) => {
    res.render('contacto');
});

router.post('/contacto', async (req, res) =>{
    const user = await Usuario.findOne({ _id: req.body.id });
    if(user){
        var hoy = new Date();
        console.log('prueba ', user.email , ' otro mas ', req.body.contenido, ' x ultimo ', hoy)
        await Contacto.create({email: user.email, contenido: req.body.contenido, hora: hoy});
    }
    res.redirect('/');
});

router.get('/admin', async (req, res, next) => {
// Como respuesta nos dara index
const usuarios = await Usuario.find();
const contactos = await Contacto.find();
console.log('launching admin');
res.render('adminPannel/admin', {usuarios, contactos});
});

router.get('/user/edit/:id', async(req,res,next)=>{
    const user = await Usuario.findById(req.params.id);
    console.log('>>>>>>>>>>>> user ' + user);
    res.render('adminPannel/editUser', {user});
});

router.post('/user/edit-user/:id', async(req,res,next)=>{
    const emailEdit = req.body.email;
    //const passwordEdit = req.body.password;
    const monedasEdit = req.body.monedas;
    //console.log('email: ' + emailEdit + ' password: ' + passwordEdit + ' monedas: '+ monedasEdit);
    let user = await Usuario.findOne({email: emailEdit});
    user.id = ' ';
    if((user && user.id != req.body.id) || isNaN(monedasEdit)){console.log('>>>>>>>>>>>>>> error')}else{
        console.log('>>>>>>>>>>>>>> todo ok')
        await Usuario.findOneAndUpdate({_id: req.body.id} , {email: emailEdit, monedas: monedasEdit});
    }
    res.redirect('/admin');
});

router.post('/user/delete/:id', async(req,res,next)=>{
    await Usuario.deleteOne({_id: req.params.id});
    res.redirect('/admin');
})


// Todas las rutas que estan por debajo se necesitara estar iniciado para acceder
router.use((req, res, next) => {
    isAuthenticated(req, res, next);
    next();
});



router.get('/cuenta', (req, res, next) => {
    var hoy = new Date();
    console.log("---------------- fecha de hoy ---------------")
    console.log(hoy);
    res.render('cuenta');
});

router.post('/cuenta', async (req, res) =>{
    var hoy = new Date();
    res.redirect('/cuenta');
    const user = await Usuario.findOne({ _id: req.body.id });
    if(user.comprobarInicioSesion(hoy)){
        await Usuario.findOneAndUpdate({_id: req.body.id} , {ult_inicio: hoy});
        await Usuario.findOneAndUpdate({_id: req.body.id} , {monedas: (user.monedas + 2)});
    }
});

router.get('/caballos', (req, res, next) => {
    // Como respuesta nos dara index
    res.render('juegos/caballos');
});

router.post('/caballos', async (req, res) =>{
    res.redirect('/caballos');
    await Usuario.findOneAndUpdate({_id: req.body.id} , {monedas: req.body.monedas});
});

router.get('/blackjack', (req, res, next) => {
    // Como respuesta nos dara index
    res.render('juegos/blackjack');
});

router.post('/blackjack', async (req, res) =>{
    res.redirect('/blackjack');
    await Usuario.findOneAndUpdate({_id: req.body.id} , {monedas: req.body.monedas});
});

router.get('/ruleta', (req, res, next) => {
    // Como respuesta nos dara index
    res.render('juegos/ruleta');
});


router.post('/ruleta', async (req, res) =>{
    res.redirect('/ruleta');
    await Usuario.findOneAndUpdate({_id: req.body.id} , {monedas: req.body.monedas});
});

router.get('/tragaperras', (req, res, next) => {
    // Como respuesta nos dara index
    res.render('juegos/tragaperras');
});




// Comprobamos si tiene la sesión iniciada
function isAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
};

// Lo ejecutamos
module.exports = router;
