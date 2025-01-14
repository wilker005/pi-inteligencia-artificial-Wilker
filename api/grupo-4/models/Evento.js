const mongoose = require('mongoose')

const EventoSchema = mongoose.Schema({
    nome: String,
    data_inicio: Date,
    categoria: String,
    descricao: String,
    url_banner: String,
    preco: Number,
    organizador: String,
    estado: String,
    cidade: String,
    endereco: String,
    numero: Number,
    data_cadastro: Date
}, { collection: "Evento"});

const Evento = mongoose.model("Evento", EventoSchema)

module.exports = Evento