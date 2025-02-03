const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const uniqueValidator = require('mongoose-unique-validator');
//const routes = require('./routes');
const User = require('./models/User');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Carregar variáveis de ambiente
dotenv.config();

// Configurar e inicializar o Express
const app = express();
app.use(express.json());
app.use(cors());

const port = 3001
const uri = process.env.MONGODB_URL
//const uri = 'mongodb://root:senha@mongo:27017/eventosgrupo1'

// app.use('/api', routes);
// app.use('/api/publico', rotasPublicas);
// app.use('/api/protegido', autenticar, rotasProtegidas); 



// Definir Esquemas e Modelos do Mongoose
const PointSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['Point'],
        required: true,
    },
    coordinates: {
        type: [Number],
        required: true,
    },
});



///////////////////// Rota de cadastro
// router.post('/cadastro', async (req, res) => {
//     const { nome, email, telefone, cpf, senha } = req.body;

//     if (!nome || !email || !telefone || !cpf || !senha) {
//         return res.status(400).json({ message: "Todos os campos são obrigatórios" });
//     }

//     try {
//         const novoUsuario = new User({
//             nome,
//             email,
//             telefone,
//             cpf,
//             senha // trocar para usar aquele jwt
//         });

//         await novoUsuario.save();

//         res.status(201).json({ message: "Usuário cadastrado com sucesso!" });
//     } catch (err) {
//         console.error("Erro ao cadastrar usuário:", err);
//         res.status(500).json({ message: "Erro ao cadastrar usuário, tente novamente." });
//     }
// });

// module.exports = router;

/////////////////////////////


const Categorias = new mongoose.Schema({ nome: String });

const EventoBaseSchema = new mongoose.Schema({
    nome: String,
    descricao: String,
    organizador: String,
});
const EventoBase = mongoose.model('EventoBase', EventoBaseSchema);

const EventosCadastrados = mongoose.model('EventosCadastrados', mongoose.Schema({
    nomeEvento: String,
    dataInicio: String,
    horario: String,
    preco: String,
    descricao: String,
    urlLogo: String,
    urlSite: String,
    cep: String,
    endereco: String,
    numero: String,
    cidade: String,
    estado: String,
    bairro: String,
    categorias: String,
    data_cadastro: String,
}));


const EventoSchema = new mongoose.Schema({
    nome: String,
    data_inicio: Date,
    preco: Number,
    descricao: String,
    url_logo: String,
    url_site: String,
    organizador: String,
    local: {
        type: PointSchema,
        required: true,
        index: '2dsphere',
    },
    endereco: String,
    cidade: String,
    estado: String,
    data_cadastro: Date,
    categorias: [Categorias],
});
const Evento = mongoose.models.Evento || mongoose.model('Evento', EventoSchema); // evento sendo definido (erro q esta dando)
/*
const usuarioSchema = new mongoose.Schema({
    nome: { type: String, required: true, unique: true },
    senha: { type: String, required: true },
});
usuarioSchema.plugin(uniqueValidator);
const Usuario = mongoose.model('Usuario', usuarioSchema);
*/
// Conectar ao MongoDB antes de iniciar o servidor
const connect = async() => {
    mongoose.connect(uri).then(() => {
    console.log(uri);
    console.log('Conectado ao MongoDB com sucesso');

    // Iniciar o servidor após a conexão com o MongoDB
    app.listen(port, () => {
        console.log(`Servidor rodando na porta ${port}`);
    });
}).catch(err => {
    console.log(uri);
    console.error('Erro ao conectar ao MongoDB:', err.message);
});
};

connect();

// Rota para criar um novo evento base
app.post("/eventos", async(req, res) => {
    try {
        const { nome, descricao, organizador } = req.body;
        const eventoBase = new EventoBase({ nome, descricao, organizador });
        await eventoBase.save();
        res.status(201).json(eventoBase);
    } catch (error) {
        res.status(500).send('Erro ao criar um novo evento base');
    }
});

// Rota para cadastro de evento
app.post("/cadastro", async(req, res) => {
    console.log("Requisição recebida para /cadastro");
    try {
        const {
            nomeEvento,
            dataInicio,
            horario,
            preco,
            descricao,
            urlLogo,
            urlSite,
            cep,
            endereco,
            numero,
            cidade,
            estado,
            categorias,
            bairro,
            data_cadastro
        } = req.body;

        // Validação de campos obrigatórios
        if (!nomeEvento || !dataInicio || !preco || !descricao || !endereco || !cidade || !estado || !categorias) {
            return res.status(400).send("Preencha todos os campos obrigatórios.");
        }

        // Criação de novo evento usando o modelo correto
        const novoEvento = new EventosCadastrados({
            nomeEvento: nomeEvento,
            dataInicio: dataInicio,
            horario: horario,
            preco: preco,
            descricao: descricao,
            urlLogo: urlLogo,
            urlSite: urlSite,
            cep: cep,
            endereco: endereco,
            numero: numero,
            cidade: cidade,
            estado: estado,
            bairro: bairro,
            categorias: categorias,
            data_cadastro: data_cadastro
        });

        // Salvando evento no MongoDB
        await novoEvento.save();

        // Buscando todos os eventos e retornando
        const eventos = await EventosCadastrados.find();
        res.json(eventos);
    } catch (error) {
        console.error("Erro ao salvar o evento no MongoDB:", error);
        res.status(500).send("Erro ao salvar ou buscar eventos.");
    }
});

// Endpoint para alterar um evento
app.put("/api/eventos/:id", async(req, res) => {
    try {
        const {
            nomeEvento,
            dataInicio,
            preco,
            descricao,
            urlLogo,
            urlSite,
            cep,
            endereco,
            numero,
            bairro,
            cidade,
            estado,
            categorias,
        } = req.body;

        // Atualização do evento existente
        const eventoAtualizado = await EventosCadastrados.findByIdAndUpdate(req.params.id, {
            nomeEvento,
            dataInicio,
            preco,
            descricao,
            urlLogo,
            urlSite,
            cep,
            endereco,
            numero,
            bairro,
            cidade,
            estado,
            categorias,
        }, { new: true });

        if (!eventoAtualizado) {
            return res.status(404).send("Evento não encontrado.");
        }

        res.status(200).json(eventoAtualizado);
    } catch (error) {
        console.error("Erro ao alterar o evento:", error);
        res.status(500).send("Erro ao alterar o evento.");
    }
});



// Endpoint para buscar um evento por ID
app.get("/eventos/:id", async(req, res) => {
    try {
        const evento = await EventosCadastrados.findById(req.params.id);
        if (!evento) {
            return res.status(404).send("Evento não encontrado.");
        }
        res.status(200).json(evento);
    } catch (error) {
        res.status(500).send("Erro ao buscar o evento.");
    }
});

// Endpoint para listar todos os eventos (nova rota)
app.get('/api/eventos', async(req, res) => {
    try {
        const eventos = await EventosCadastrados.find();
        res.json(eventos);
    } catch (error) {
        res.status(500).send('Erro ao buscar os eventos');
    }
});

// Endpoint para listar todos os eventos
app.get("/eventos", async(req, res) => {
    try {
        const eventos = await EventosCadastrados.find();
        res.status(200).json(eventos);
    } catch (error) {
        res.status(500).send("Erro ao buscar eventos.");
    }
});

// Rota para buscar um evento específico por ID
app.get('/api/eventos/:id', async(req, res) => {
    try {
        const evento = await EventosCadastrados.findById(req.params.id);
        if (evento) {
            res.json(evento);
        } else {
            res.status(404).send('Evento não encontrado');
        }
    } catch (error) {
        res.status(500).send('Erro ao buscar o evento');
    }
});






// Rota para cadastro de usuário (signup)
app.post('/signup', async (req, res) => {
    const { email, nome, telefone, cpf, senha } = req.body;

    if (!email || !nome || !telefone || !cpf || !senha) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios" });
    }

    try {
        const novoUsuario = new User({
            email,
            nome,
            telefone,
            cpf,
            senha: await bcrypt.hash(senha, 10), // Criptografando a senha
        });

        await novoUsuario.save();
        console.log("Usuário criado:", novoUsuario);  // Adicionando um log para verificar os dados

        res.status(201).json({ message: "Usuário cadastrado com sucesso!" });
    } catch (err) {
        console.error("Erro ao cadastrar usuário:", err);
        res.status(500).json({ message: "Erro ao cadastrar usuário, tente novamente." });
    }
});


// module.exports = router;


// Rota para login de usuário


app.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }

        const senhaValida = await bcrypt.compare(senha, user.senha);
        if (!senhaValida) {
            return res.status(401).json({ message: "Senha inválida" });
        }

        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET || "chave-secreta", {
            expiresIn: "1h",
        });

        res.status(200).json({ nome: user.nome, token });
    } catch (error) {
        console.error('Erro ao realizar login:', error);
        res.status(500).json({ message: "Erro interno do servidor" });
    }
});



function autenticar(req, res, next) {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'Acesso não autorizado.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'chave-secreta');
        req.usuario = decoded; // Adiciona os dados do usuário decodificados ao objeto `req`
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token inválido.' });
    }
}

module.exports = autenticar;

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

app.post("/gerar-descricao", async (req, res) => {
    try {
        const { palavrasChave } = req.body;

        if (!palavrasChave) {
            return res.status(400).json({ erro: "Palavras-chave são obrigatórias." });
        }

        // Selecionando o modelo Gemini
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        // Gerando a descrição
        const response = await model.generateContent(`Crie uma descrição para um evento com os seguintes temas: ${palavrasChave}.`);
        const descricao = response.response.text(); // Pegando o texto gerado

        res.json({ descricao });
    } catch (error) {
        console.error("Erro ao gerar descrição:", error);
        res.status(500).json({ erro: "Erro interno ao gerar descrição" });
    }
});