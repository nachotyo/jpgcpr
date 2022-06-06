const passport = require('passport');
const { db } = require('../models/usuario');
const LocalStrategy = require('passport-local').Strategy;
const Usuario = require('../models/usuario');

// Cuando el usuario inicie sesión vamos a guardar los datos en el navegador para que no se pierda la sesión cuando el usuario se mueva entre paginas
passport.serializeUser((usuario, done) => {
    done(null, usuario.id);
});

// Buscamos si existe el usuario en la base de datos
passport.deserializeUser(async (id, done) => {
    const usuario = await Usuario.findById(id);
    done(null, usuario);
});

// El metodo para autenticar usuarios
passport.use('local-registrarse', new LocalStrategy({
    // Los datos que vamos a recibir
    // El nombre del usuario
    usernameField: 'email',
    // La contraseña
    passwordField: 'password',

    passReqToCallback: true
}, async (req, email, password, done) => {

    const user = await Usuario.findOne({ email: email });
    if (user) {
        return done(null, false, req.flash('msgRegistrarse', 'Ya existe una cuenta con ese email.'));
    } else {
        var hoy = new Date();
        const nuevoUsuario = new Usuario();
        nuevoUsuario.email = email;
        // Encriptamos la contraseña
        nuevoUsuario.password = nuevoUsuario.encriptarContrasena(password);
        nuevoUsuario.monedas = 10;
        nuevoUsuario.ult_inicio = hoy;
        nuevoUsuario.esAdmin = false;
        // Cuando termine de guardarlo avanza a la siguiente linea
        await nuevoUsuario.save();
        // Devolvemos el error y el usuario
        done(null, nuevoUsuario);
    }
}));

passport.use('local-iniciarSesion', new LocalStrategy({
    // Los datos que vamos a recibir
    // El nombre del usuario
    usernameField: 'email',
    // La contraseña
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    const user = await Usuario.findOne({email: email});
    // Update
    // await Usuario.updateOne({ email: email}, { monedas: 23 });
    if(!user){
        return done(null, false, req.flash('msgIniciarSesion', 'No existe una cuenta con ese correo.'));
    }
    if(!user.compararContrasena(password)){
        return done(null, false, req.flash('msgIniciarSesion', 'Contraseña incorrecta.'));
    }
    done(null, user);
}));