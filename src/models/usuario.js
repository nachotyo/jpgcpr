const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
// Vamos a utilizar el schema de mongoose para definir los usuarios
const { Schema } = mongoose;

const userSchema = new Schema({
    email:String,
    password: String,
    monedas: Number,
    ult_inicio: Date,
    esAdmin: Boolean
});

// Metodo para encriptar contraseñas 
userSchema.methods.encriptarContrasena = (password) =>{
    // Le pasamos la contraseña que tenemos que encriptar y las veces que querramos que la encripte
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

// Metodo para comprobar las contraseñas del usuario, devuelve un boolean
userSchema.methods.compararContrasena = function (password){
    return bcrypt.compareSync(password, this.password);
};

userSchema.methods.actualizarMonedas = function(email, monedas){
    Usuario.updateOne({ email: email}, { monedas: monedas });
};

userSchema.methods.comprobarInicioSesion = function (hora){
    return ((this.ult_inicio.getMonth() + 1) < (hora.getMonth() + 1) || (this.ult_inicio.getDate() ) < (hora.getDate()));
}

// Asi se van a guardar los usuarios en la base de datos
module.exports = mongoose.model('usuarios', userSchema);