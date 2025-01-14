// Função para carregar os eventos de uma categoria
document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const categoria = urlParams.get("categoria");

    if (categoria) {
        // Renderize os eventos com base na categoria recebida
        document.getElementById("categoriaTitulo").innerText = `Eventos de ${categoria}`;
        // Exemplo: carregue eventos dinamicamente
        carregarEventosPorCategoria(categoria);
    }
});

function carregarEventosPorCategoria(categoria) {
    // Simulação de carregamento de eventos para a categoria
    const eventosContainer = document.getElementById("eventosContainer");
    eventosContainer.innerHTML = `Eventos para a categoria: ${categoria}`;
}

// Redirecionar para a página da categoria
function navegarParaCategoria(categoria) {
    // Redirecionar para a página categoria.html com o parâmetro da categoria na URL
    const url = `categoria.html?categoria=${encodeURIComponent(categoria)}`;
    window.location.href = url;
}


// Adicionar evento de clique para as categorias no index.html
document.querySelectorAll(".categoria").forEach(item => {
    item.addEventListener("click", function () {
        const categoria = this.nextElementSibling.innerText;
        navegarParaCategoria(categoria);
    });
});
