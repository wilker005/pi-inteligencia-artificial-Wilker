const signupOption = document.querySelector('#signupOption');
const loginOption = document.querySelector('#loginOption');

const userForm = document.querySelector('#signupForm');
const userLogin = document.querySelector('#loginForm');

const orgForm = document.querySelector('#signupOrgForm');
const orgLogin = document.querySelector('#loginOrgForm');

signupOption.addEventListener('change', () => {
    if (signupOption.value === 'usuario') {
        userForm.classList.remove('d-none');
        orgForm.classList.add('d-none');
    } else if (signupOption.value === 'empresa') {
        orgForm.classList.remove('d-none');
        userForm.classList.add('d-none');
    } else {
        userForm.classList.add('d-none');
        orgForm.classList.add('d-none');
    }
});

loginOption.addEventListener('change', () => {
    if (loginOption.value === 'usuario') {
        userLogin.classList.remove('d-none');
        orgLogin.classList.add('d-none');
    } else if (loginOption.value === 'empresa') {
        orgLogin.classList.remove('d-none');
        userLogin.classList.add('d-none');
    } else {
        userLogin.classList.add('d-none');
        orgLogin.classList.add('d-none');
    }
});

const showMessage = (messageId, type, text) => {
    const messageElement = document.getElementById(messageId);

    if (messageElement) {
        messageElement.className = `alert alert-${type}`;
        messageElement.textContent = text;
        messageElement.classList.remove('d-none');
    } else {
        console.error(`Elemento com ID "${messageId}" não encontrado no DOM.`);
    }
};

const updateUI = () => {
    const token = localStorage.getItem('token');
    const btnLogin = document.getElementById('btnLogin');
    const btnSignup = document.getElementById('btnSignup');
    const btnLogout = document.getElementById('btnLogout');

    if (token) {
        btnLogin.classList.add('d-none');
        btnSignup.classList.add('d-none');
        btnLogout.classList.remove('d-none');
    } else {
        btnLogin.classList.remove('d-none');
        btnSignup.classList.remove('d-none');
        btnLogout.classList.add('d-none');
    }
};

const handleSubmit = (formId, endpoint, messageId, callback) => {
    const form = document.getElementById(formId);
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(form).entries());

        try {
            const response = await axios.post(endpoint, data);

            if (endpoint.includes('/login')) {
                const { token } = response.data;
                localStorage.setItem('token', token);
                updateUI();
            } else if (endpoint.includes('/loginOrganizador')) {
                const { token } = response.data;
                localStorage.setItem('token', token);
                updateUI();
            }

            showMessage(messageId, 'success', 'Operação realizada com sucesso!');

            setTimeout(() => {
                const modalId = formId === 'loginForm' ? 'loginModal' :
                    formId === 'signupOrgForm' ? 'signupModal' :
                        formId === 'signupForm' ? 'signupModal' :
                            'loginModal';

                const modal = document.getElementById(modalId);
                if (modal) {
                    const modalInstance = bootstrap.Modal.getInstance(modal);
                    if (modalInstance) modalInstance.hide();
                }

                document.getElementById(messageId).classList.add('d-none');
                form.reset();
                if (callback) callback();
            }, 3000);
        } catch (error) {
            const errorMessage = error.response?.data?.mensagem || 'Erro ao conectar-se ao servidor.';
            showMessage(messageId, 'danger', errorMessage);
        }
    });
};

// Logout handler
const btnLogout = document.getElementById('btnLogout');
btnLogout.addEventListener('click', () => {
    localStorage.removeItem('token'); // Remove o token
    updateUI(); // Atualiza a interface
});

// Inicialização
window.addEventListener('load', () => {
    updateUI(); // Atualiza a interface ao carregar a página
});

const handleCreateEvent = () => {
    const btnCreateEvent = document.getElementById('btnCreateEvent');

    btnCreateEvent.addEventListener('click', (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        if (!token) {
            // Caso o usuário não esteja logado, exibir alerta e modal de login
            exibirAlerta('.alert-evento', 'Você precisa estar logado para criar um evento', ['show', 'alert-warning'], ['d-none'], 3000);

            // Exibir modal de login
            setTimeout(() => {
                const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
                loginModal.show();
            }, 1000);
        } else {
            window.location.href = 'addEvento.html';
        }
    });
};

handleCreateEvent();

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

handleSubmit('loginForm', 'http://localhost:3000/login', 'loginMessage');
handleSubmit('loginOrgForm', 'http://localhost:3000/loginOrganizador', 'loginOrgMessage');
handleSubmit('signupForm', 'http://localhost:3000/signup', 'signupMessage');
handleSubmit('signupOrgForm', 'http://localhost:3000/organizador', 'signupOrgMessage');