const express = require('express')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const cors = require('cors');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const uniqueValidator = require('mongoose-unique-validator')

const routes = require("./routes/Router")

const app = express()

app.use(express.json())
app.use(cors())
const port = 3004;
dotenv.config();
const uri = process.env.MONGODB_URL
//const uri = 'mongodb://root:senha@mongo:27017/eventosgrupo4'

const usuarioSchema = mongoose.Schema({
    login: { type: String, required: true, unique: true },
    type: { type: String, enum: ['cpf', 'cnpj'], required: true }, // Tipo de cadastro
    document: { type: String, required: true }, // CPF ou CNPJ
    phone: { type: String, required: true }, // Telefone
    email: { type: String, required: true, unique: true }, // Email único
    password: { type: String, required: true } // Senha
});

usuarioSchema.plugin(uniqueValidator)
const Usuario = mongoose.model("Usuario", usuarioSchema)
module.exports = Usuario;

app.use(routes)

app.post('/signup', async (req, res) => {
    try {
        const { login, type, document, phone, email, password } = req.body;

        // Validação básica (opcional)
        if (!['cpf', 'cnpj'].includes(type)) {
            return res.status(400).json({ mensagem: "Tipo de cadastro inválido" });
        }

        // Validação do formato do CPF ou CNPJ
        const { cpf, cnpj } = require('cpf-cnpj-validator');
        if (type === 'cpf' && !cpf.isValid(document)) {
            return res.status(400).json({ mensagem: "CPF inválido" });
        }
        if (type === 'cnpj' && !cnpj.isValid(document)) {
            return res.status(400).json({ mensagem: "CNPJ inválido" });
        }

        // Criptografar a senha
        const hashedPassword = await bcrypt.hash(password, 10);

        // Criar novo usuário
        const usuario = new Usuario({
            login,
            type,
            document,
            phone,
            email,
            password: hashedPassword
        });

        // Salvar no banco de dados
        await usuario.save();

        res.status(201).json({ mensagem: "Usuário cadastrado com sucesso" });
    } catch (error) {
        console.error(error);

        // Tratamento para erro de duplicidade (MongoDB)
        if (error.code === 11000) {
            const duplicatedField = Object.keys(error.keyValue).join(", ");
            return res.status(409).json({ mensagem: `${duplicatedField} já está em uso` });
        }

        res.status(500).json({ mensagem: "Erro ao cadastrar usuário" });
    }
});


app.post('/login', async(req, res) => {
    try {
        const login = req.body.login
        const password = req.body.password
        const u = await Usuario.findOne({ login: req.body.login })
        if (!u) {
            return res.status(401).json({ mensagem: "Login inválido" })
        }
        const senhaValida = await bcrypt.compare(password, u.password)
        if (!senhaValida) {
            return res.status(401).json({ mensagem: "Senha inválida" })
        }
        const token = jwt.sign({ login: login },
            "chave-secreta", { expiresIn: "1h" }
        )
        res.status(200).json({ token: token })
    } catch (error) {

    }
})

async function conectarAoMongo() {
    await mongoose.connect(uri, {});
}

app.listen(port, () => {
    try {
        conectarAoMongo()
        console.log(`Servidor rodando na port ${port}`)
    } catch (error) {
        console.log("Erro", e)
    }
})