const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const usuarioSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    telefone: { type: String, required: true },
    cpf: { type: String, required: true },
    senha: { type: String, required: true },
});

usuarioSchema.plugin(uniqueValidator);

usuarioSchema.methods.validarSenha = async function (senha) {
    return await bcrypt.compare(senha, this.senha);
};

usuarioSchema.methods.gerarToken = function () {
    return jwt.sign(
        { id: this._id, email: this.email },
        process.env.JWT_SECRET || 'chave-secreta',
        { expiresIn: '1h' }
    );
};

module.exports = mongoose.model('Usuario', usuarioSchema);
