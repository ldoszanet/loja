// ============================================
// CARRINHO DE COMPRAS USANDO LOCALSTORAGE
// ============================================

function obter_carrinho() {
    const carrinho = localStorage.getItem("carrinho");
    return carrinho ? JSON.parse(carrinho) : [];
}

function salvar_carrinho(carrinho) {
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

function adicionar_ao_carrinho(produto) {
    const carrinho = obter_carrinho();
    // Compara IDs convertendo para string para evitar erros de tipagem
    const item_existente = carrinho.find(item => String(item.id) === String(produto.id));

    if (item_existente) {
        item_existente.quantidade += 1;
    } else {
        carrinho.push({
            id: produto.id,
            nome: produto.nome,
            preco: produto.preco,
            caminho_img: produto.caminho_img,
            quantidade: 1
        });
    }

    salvar_carrinho(carrinho);
    atualizar_contador_carrinho();
}

function remover_do_carrinho(id_produto) {
    let carrinho = obter_carrinho();
    carrinho = carrinho.filter(item => String(item.id) !== String(id_produto));
    salvar_carrinho(carrinho);
    atualizar_contador_carrinho();
}

function alterar_quantidade(id_produto, nova_quantidade) {
    const carrinho = obter_carrinho();
    const item = carrinho.find(item => String(item.id) === String(id_produto));

    if (!item) return;

    if (nova_quantidade <= 0) {
        remover_do_carrinho(id_produto);
        return;
    }

    item.quantidade = nova_quantidade;
    salvar_carrinho(carrinho);
    atualizar_contador_carrinho();
}

function limpar_carrinho() {
    localStorage.removeItem("carrinho");
    atualizar_contador_carrinho();
}

function calcular_total_carrinho() {
    const carrinho = obter_carrinho();
    return carrinho.reduce((total, item) => {
        return total + (parseFloat(item.preco) * item.quantidade);
    }, 0);
}

function atualizar_contador_carrinho() {
    const carrinho = obter_carrinho();
    const total_itens = carrinho.reduce((soma, item) => soma + item.quantidade, 0);

    const link_carrinho = document.querySelector('a[href="carrinho.html"]');
    if (!link_carrinho) return;

    const antigo = link_carrinho.querySelector(".badge-carrinho");
    if (antigo) antigo.remove();

    if (total_itens > 0) {
        const badge = document.createElement("span");
        badge.className = "badge-carrinho";
        badge.textContent = total_itens;
        link_carrinho.appendChild(badge);
    }
}

// Função chamada no index.html ao clicar em "Comprar"
// Ela recebe o objeto do produto pronto, sem precisar de fetch
function comprar(produto) {
    try {
        adicionar_ao_carrinho(produto);
        mostrarToast("✅ Produto adicionado ao carrinho!", "bg-success");
    } catch (error) {
        console.error(error);
        mostrarToast("❌ Erro ao adicionar produto: " + error.message, "bg-danger");
    }
}

window.addEventListener("DOMContentLoaded", atualizar_contador_carrinho);