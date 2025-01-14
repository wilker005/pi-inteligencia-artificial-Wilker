const mongoose = require('mongoose');

const detalheEventoSchema = new mongoose.Schema({
    eventoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Evento',
        required: true
    },
    detalhes: {
        nomeEvento: { type: String, required: true },
        dataInicio: { type: Date, required: true },
        preco: { type: Number, required: true },
        descricao: { type: String, required: true },
        urlLogo: { type: String, required: true },
        urlSite: { type: String, required: true },
        endereco: { type: String, required: true },
        cidade: { type: String, required: true },
        estado: { type: String, required: true },
        categoria: { type: String, required: true },
        numero: { type: String, required: true },
        cep: { type: String, required: true },
        data_cadastro: { type: Date, default: Date.now }
    },
});

const DetalheEvento = mongoose.models.DetalheEvento || mongoose.model('DetalheEvento', detalheEventoSchema);

module.exports = DetalheEvento;
