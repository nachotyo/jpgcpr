// Creamos la base de datos
const mongoose = require('mongoose');
// Obetenemos el objeto mongodb
const { mongodb } = require('./keys');

// Nos conectamos a la base de datos y mostramos por consola si se ha conectado
mongoose.connect(mongodb.URI, {useNewUrlParser: true})
.then(db => console.log('La base de datos esta conectada'))
.catch(err => console.log(err));