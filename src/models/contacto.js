const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
// Vamos a utilizar el schema de mongoose para definir los usuarios
const { Schema } = mongoose;

const userSchema = new Schema({
    email:String,
    contenido:String,
    hora:Date
});
module.exports = mongoose.model('contacto', userSchema);