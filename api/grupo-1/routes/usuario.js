const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const User = require('../models/User');  



router.post(
    '/signup',
    [
        check('nome').notEmpty().withMessage('O nome é obrigatório.'),
        check('email').isEmail().withMessage('Forneça um email válido.'),
        check('telefone').notEmpty().withMessage('O telefone é obrigatório.'),
        check('cpf').notEmpty().withMessage('O CPF é obrigatório.'),
        check('senha').isLength({ min: 6 }).withMessage('A senha deve ter no mínimo 6 caracteres.'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { nome, email, senha } = req.body;

            const usuarioExistente = await User.findOne({ email }); 
            if (usuarioExistente) {
                return res.status(409).json({ message: 'Usuário já existe com este email.' });
            }

            const hashedPassword = await bcrypt.hash(senha, 10);
            const usuario = new User({  
                nome,
                email,
                senha: hashedPassword,
            });

            const novoUsuario = await usuario.save();
            res.status(201).json({
                message: 'Usuário cadastrado com sucesso!',
                data: novoUsuario,
            });
        } catch (error) {
            console.error("Erro interno ao cadastrar usuário:", error);
            res.status(500).json({ message: "Erro interno do servidor." });
        }
    }
);


app.post('/login', async(req, res) => {
    try {
        const { email, password } = req.body;
        const usuario = await Usuario.findOne({ email });
        if (!usuario) {
            return res.status(401).json({ mensagem: "E-mail inválido" });
        }
        const senhaValida = await bcrypt.compare(password, usuario.senha);
        if (!senhaValida) {
            return res.status(401).json({ mensagem: "Senha inválida" });
        }
        const token = jwt.sign({ email }, "chave-secreta", { expiresIn: "1h" });
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).send("Erro ao realizar login");
    }
});

module.exports = router;
