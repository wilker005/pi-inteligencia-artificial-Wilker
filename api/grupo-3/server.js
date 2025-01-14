const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const uniqueValidator = require('mongoose-unique-validator');
const haversine = require('haversine-distance'); // Instale com npm: npm install haversine-distance

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const port = 3003
const uri = process.env.MONGODB_URL
//const uri = 'mongodb://root:senha@mongo:27017/eventosgrupo3'

// ================== SCHEMAS ================== //
// Esquema para Eventos
const EventosGrupo3 = mongoose.model('EventosGrupo3', mongoose.Schema({
    nome: String, 
    dataInicio: String, 
    preco: String, 
    descricao: String,
    urlLogo: String,
    urlSite: String, 
    cep: String,
    endereco: String,
    cidade: String,
    estado: String,
    numero : String,
    categorias: String,
    dataCadastro: String
}));

// Esquema para Usuários
const cadastroUsuarioSchema = mongoose.Schema({
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    senha: { type: String, required: true },
});
cadastroUsuarioSchema.plugin(uniqueValidator);
const Usuario = mongoose.model('Usuario', cadastroUsuarioSchema);

// ================== ROTAS ================== //
// Rota POST - Cadastrar Evento
app.post("/cadastrar", async (req, res) => {
    const nome = req.body.nome
    const dataInicio = new Date(req.body.dataInicio);
    const preco = req.body.preco 
    const descricao = req.body.descricao 
    const urlLogo = req.body.urlLogo
    const urlSite = req.body.urlSite
    const cep = req.body.cep
    const endereco = req.body.endereco
    const cidade = req.body.cidade
    const estado = req.body.estado
    const numero = req.body.numero
    const categorias = req.body.categorias
    const dataCadastro = new Date()

    if (isNaN(dataInicio.getTime())) {
        return res.status(400).json({ mensagem: "Data de início inválida" });
    }

    const eventoGrupo3 = new EventosGrupo3 ({
        nome : nome,
        dataInicio: dataInicio.toISOString(),
        preco : preco, 
        descricao : descricao,
        urlLogo : urlLogo,
        urlSite : urlSite, 
        cep : cep,
        endereco : endereco,
        cidade : cidade, 
        estado : estado, 
        numero : numero,
        categorias : categorias,
        dataCadastro : dataCadastro
    })
    await eventoGrupo3.save()
    const eventos = await EventosGrupo3.find()
    res.json(eventos)
})

// Rota GET - Listar Eventos Ordenados
app.get('/eventosOrdenados', async (req, res) => {
    try {
        const eventos = await EventosGrupo3.find().sort({ nome: 1 });
        res.json(eventos);
    } catch (error) {
        console.error('Erro ao buscar eventos:', error);
        res.status(500).json({ mensagem: 'Erro ao buscar eventos.', erro: error.message });
    }
});

// Rota POST - Cadastro de Usuário
app.post('/cadastroUsuario', async (req, res) => {
    try {
        const { nome, email, senha, confirmarSenha } = req.body;
        if (senha !== confirmarSenha) return res.status(400).send('As senhas não coincidem.');

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const usuario = new Usuario({ nome, email, senha: senhaCriptografada });
        await usuario.save();

        res.status(201).send('Usuário cadastrado com sucesso!');
    } catch (error) {
        console.error('Erro ao cadastrar usuário:', error);
        if (error.code === 11000) return res.status(409).send('E-mail já cadastrado.');
        res.status(500).send('Erro ao cadastrar usuário.');
    }
});

// Rota POST - Login de Usuário
app.post('/loginUsuario', async (req, res) => {
    try {
        const email = req.body.email
        const senha = req.body.senha
        const usuario = await Usuario.findOne({ email: req.body.email })

        if (!usuario) {
            return res.status(401).json({ mensagem: "email inválido" })
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senha)
        if (!senhaValida) {
            return res.status(401).json({ mensagem: "Senha inválida" })
        }

        const token = jwt.sign({ email: email },
            "chave-secreta", { expiresIn: "1h" }
        )
        res.status(200).json({ token: token })
        
    } catch (error) {
        res.status(500).json({ message: "Ocorreu um erro ao fazer login ", error })
        console.log(error)
    }
})

// Rota GET - Listar Eventos Recentes
app.get('/eventosRecentes', async (req, res) => {
    try {
        const eventos = await EventosGrupo3.find().sort({ dataCadastro: -1 }); // Mais recentes primeiro
        res.json(eventos);
    } catch (error) {
        console.error('Erro ao buscar eventos recentes:', error);
        res.status(500).json({ mensagem: 'Erro ao buscar eventos recentes.', erro: error.message });
    }
});

// Rota GET - Listar eventos para o carrossel
app.get('/eventosCarrossel', async (req, res) => {
    try {
        // Busca os 3 eventos mais recentes
        const eventos = await EventosGrupo3.find().sort({ dataCadastro: -1 }).limit(3);
        res.json(eventos);
    } catch (error) {
        console.error('Erro ao buscar eventos para o carrossel:', error);
        res.status(500).json({ mensagem: 'Erro ao buscar eventos.', erro: error.message });
    }
});

// Rota GET - Buscar evento por ID
app.get('/evento/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const evento = await EventosGrupo3.findById(id);

        if (!evento) {
            return res.status(404).json({ mensagem: "Evento não encontrado" });
        }

        res.json(evento);
    } catch (error) {
        console.error('Erro ao buscar evento:', error);
        res.status(500).json({ mensagem: 'Erro ao buscar evento', erro: error.message });
    }
});

// Rota GET - Buscar eventos por nome
app.get('/pesquisar', async (req, res) => {
    try {
        const { q } = req.query; // Parâmetro da busca
        const regex = new RegExp(q, 'i'); // Busca case-insensitive
        const eventos = await EventosGrupo3.find({ nome: regex });
        res.json(eventos);
    } catch (error) {
        console.error('Erro ao buscar eventos:', error);
        res.status(500).json({ mensagem: 'Erro ao buscar eventos', erro: error.message });
    }
});

app.post('/salvarLocalizacao', async (req, res) => {
    try {
        const { latitude, longitude } = req.body;

        // Aqui você pode salvar no banco de dados, exemplo:
        console.log(`Localização recebida: Latitude ${latitude}, Longitude ${longitude}`);

        res.status(200).json({ mensagem: "Localização salva com sucesso!" });
    } catch (error) {
        console.error('Erro ao salvar localização:', error);
        res.status(500).json({ mensagem: 'Erro ao salvar localização.' });
    }
});

// Rota GET - Buscar eventos pela cidade
app.get('/eventosPorCidade', async (req, res) => {
    try {
        const { cidade } = req.query;

        if (!cidade) {
            return res.status(400).json({ mensagem: 'A cidade não foi fornecida.' });
        }

        // Filtra os eventos pela cidade (case-insensitive)
        const eventos = await EventosGrupo3.find({ 
            cidade: { $regex: new RegExp(cidade, 'i') } 
        });

        res.json(eventos);
    } catch (error) {
        console.error('Erro ao buscar eventos pela cidade:', error);
        res.status(500).json({ mensagem: 'Erro ao buscar eventos pela cidade.' });
    }
});


// ================== CONEXÃO COM O BANCO ================== //
async function conectarAoMongo() {
    try {
        await mongoose.connect(uri, {});
        console.log('Conexão ao MongoDB bem-sucedida!');
    } catch (error) {
        console.error('Erro ao conectar ao MongoDB:', error);
    }
}

app.listen(port, () => {
    conectarAoMongo();
    console.log(`Servidor rodando na porta ${port}`);
});
