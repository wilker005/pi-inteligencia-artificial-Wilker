async function buscarCEP(cep) {
    try {
        const url = `https://viacep.com.br/ws/${cep}/json/`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.erro) {
            alert("CEP não encontrado!");
            document.querySelector("#estado").value = "";
            document.querySelector("#cidade").value = "";
            document.querySelector("#endereco").value = "";
        } else {
            document.querySelector("#estado").value = data.uf;
            document.querySelector("#cidade").value = data.localidade;
            document.querySelector("#endereco").value = data.logradouro;
        }
    } catch (error) {
        console.error("Erro ao buscar o CEP:", error);
        alert("Erro ao buscar o CEP. Tente novamente.");
        document.querySelector("#estado").value = "";
        document.querySelector("#cidade").value = "";
        document.querySelector("#endereco").value = "";
    }
}

document.getElementById("cep").addEventListener("blur", function () {
    const cep = this.value.replace(/\D/g, ""); // Remove caracteres não numéricos
    if (cep.length === 8) { // Verifica se o CEP tem 8 dígitos
        buscarCEP(cep);
    } else {
        alert("CEP inválido! Digite um CEP com 8 dígitos.");
    }
});

async function postEvent(event) {
    event.preventDefault();

    const eventosEndpoint = '/eventos';
    const URLCompleta = `http://localhost:3000${eventosEndpoint}`;

    const token = localStorage.getItem('token');
    if (!token) {
        exibirAlerta('warning', 'Você precisa estar logado para criar um evento');
        return;
    }

    let organizador;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.login) {
            organizador = payload.login;
        } else if (payload.nome_empresa) {
            organizador = payload.nome_empresa;
        } else {
            throw new Error("Organizador não encontrado no token");
        }
    } catch (error) {
        console.error("Erro ao decodificar o token:", error);
        exibirAlerta('error', 'Token inválido. Faça login novamente.');
        return;
    }

    const nome = document.querySelector('#nomeEvento').value;
    const data_inicio = document.querySelector('#dataInicio').value;
    const categoria = document.querySelector('#categoria').value;
    const descricao = document.querySelector('#descricao').value;
    const url_banner = document.querySelector('#banner').value;
    const preco = parseFloat(document.querySelector('#precoIngresso').value);
    const estado = document.querySelector('#estado').value;
    const cidade = document.querySelector('#cidade').value;
    const endereco = document.querySelector('#endereco').value;
    const numero = document.querySelector('#numero').value;

    if (!nome || !data_inicio || !categoria || !descricao || !url_banner || isNaN(preco) || !estado || !cidade || !endereco || !numero) {
        exibirAlerta('error', 'Preencha todos os campos corretamente');
        return;
    }

    // Validação da data de início
    const dataAtual = new Date(); // Data atual
    const dataInicio = new Date(data_inicio); // Data do evento

    // Garantir que a data do evento seja hoje ou no futuro
    if (dataInicio < dataAtual.setHours(0, 0, 0, 0)) {
        exibirAlerta('error', 'Data de início inválida');
        return;
    }

    try {
        const response = await axios.post(URLCompleta, {
            nome,
            data_inicio,
            categoria,
            descricao,
            url_banner,
            preco,
            organizador,
            estado,
            cidade,
            endereco,
            numero
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });

        exibirAlerta('success', 'Evento cadastrado com sucesso!');
    } catch (error) {
        console.error("Erro ao cadastrar evento:", error);
        exibirAlerta('error', 'Erro ao cadastrar evento');
    }
}

// Função para exibir alertas
function exibirAlerta(tipo, mensagem) {
    Swal.fire({
        icon: tipo,
        title: mensagem,
        showConfirmButton: false,
        timer: 3000,
        toast: true,
        position: 'top-end',
    });
}

const formularioEvento = document.querySelector('#formEvento');
formularioEvento.addEventListener('submit', postEvent);