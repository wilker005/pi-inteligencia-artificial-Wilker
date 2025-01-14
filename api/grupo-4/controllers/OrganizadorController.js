const Organizador = require("../models/Organizador")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { cnpj } = require('cpf-cnpj-validator')

const getOrganizadores = async (req, res) => {
    const organizadores = await Organizador.find()
    res.json(organizadores)
}

const postOrganizador = async (req, res) => {
    try {
        const nome = req.body.nome
        const telefone = req.body.telefone
        const email = req.body.email
        const senha = req.body.senha
        const cnpjInput = req.body.cnpj
        const url_logo = req.body.url_logo
        const url_banner = req.body.url_banner
        const estado = req.body.estado
        const cidade = req.body.cidade
        const endereco = req.body.endereco
        const numero = req.body.numero

        if (typeof senha !== 'string') {
            return res.status(400).json({ mensagem: "Senha inválida" });
        }

        if (!cnpj.isValid(cnpjInput)) {
            return res.status(400).json({ mensagem: "CNPJ inválido" });
        }

        const cryptografada = await bcrypt.hash(senha, 10)

        const organizador = new Organizador({
            nome: nome,
            telefone: telefone,
            email: email,
            senha: cryptografada,
            cnpj: cnpjInput,
            url_logo: url_logo,
            url_banner: url_banner,
            estado: estado,
            cidade: cidade,
            endereco: endereco,
            numero: numero 
        })
        
        const novoOrganizador = await organizador.save();
        
        const viewOrganizador = await Organizador.findOne({ _id: novoOrganizador._id });
 
        res.json(viewOrganizador);

    } catch(error) {
        console.log(error)
        res.status(500).json({ mensagem: "Erro ao salvar novo organizador" })
    }
}

const login = async (req, res) => {
    try {
        const email = req.body.email
        const senha = req.body.senha
        const organizador = await Organizador.findOne({ email: req.body.email })
        if (!organizador) {
            return res.status(401).json({ mensagem: "Login inválido" })
        }
        const senhaValida = await bcrypt.compare(senha, organizador.senha)
        if (!senhaValida) {
            return res.status(401).json({ mensagem: "Senha inválida" })
        }
        const token = jwt.sign({ email: email, nome_empresa: organizador.nome },
            "chave-secreta", { expiresIn: "1h" }
        )
        res.status(200).json({ token: token })
    } catch (error) {
        console.log(`Error: ${error}`)
    }
}

module.exports = {
    getOrganizadores,
    postOrganizador,
    login
}