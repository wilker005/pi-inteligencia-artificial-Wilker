const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const OrganizadorSchema =  new mongoose.Schema({
    nome: String,
    telefone: String,
    email: String,
    senha: String,
    cnpj: String,
    url_logo: String,
    url_banner: String,
    estado: String,
    cidade: String,
    endereco: String,
    numero: Number
}, { collection: "Organizador"})

OrganizadorSchema.plugin(uniqueValidator);

const Organizador = new mongoose.model("Organizador", OrganizadorSchema)

module.exports = Organizador