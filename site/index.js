async function carregar_produtos(busca=false) {
    if (busca==false) {
        const paramsDaUrl = new URLSearchParams(window.location.search);
        if (paramsDaUrl.toString() !== "") {
            if (paramsDaUrl.has("busca")) {
                document.getElementById("input-busca").value = paramsDaUrl.get("busca");
            }
            if (paramsDaUrl.has("ordenacao")) {
                document.getElementById("select-ordem").value = paramsDaUrl.get("ordenacao");
            }
        }
    }

    const params = new URLSearchParams();
    const valorBusca = document.getElementById("input-busca").value;
    const valorOrdem = document.getElementById("select-ordem").value;
    if (valorBusca.trim() !== "") {
        params.append("busca", valorBusca);
    }
    if (valorOrdem.trim() !== "") {
        params.append("ordenacao", valorOrdem);
    }

    const paramsString = params.toString();
    window.history.pushState({}, "", paramsString ? `?${paramsString}` : window.location.pathname);

    try{
        const produtos = await buscar_produtos(params);

        const container = document.getElementById("produtos");
        container.replaceChildren();
        if (produtos.length == 0){
            container.className = "";
            container.innerHTML = 
                '<p style="margin: 0; text-align: center;">❌ Não foi encontrado nenhum produto para essa busca!</p>';
            return;
        }
        container.className = "grid-produtos"
        
        produtos.forEach(produto => {
            const card = document.createElement("div");
            card.className = "card";

            // Passamos o objeto do produto como string JSON direto para a função comprar
            card.innerHTML = `
                <img src="${produto.caminho_img}" alt="${produto.nome}">
                <div class="nome-produto">${produto.nome}</div>
                <div class="info">
                    <div class="descricao">${produto.descricao.substring(0, 40)}...</div>
                    <div class="preco">R$ ${produto.preco.replace(".", ",")}</div>
                </div>
                <button class="btn_enviar" onclick='comprar(${JSON.stringify(produto)})'>Comprar</button>
            `;

            container.appendChild(card);
        });

    } catch (error) {
        console.error("Erro ao carregar produtos:", error);
        const container = document.getElementById("produtos");
        container.className = "";
        container.innerHTML = 
                '<p style="margin: 0; text-align: center;">❌ Não foi possível carregar os produtos.</p>';
    }
}

window.addEventListener("DOMContentLoaded", carregar_produtos)