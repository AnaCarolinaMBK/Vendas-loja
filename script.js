// Banco de dados salvo no navegador
let estoque = JSON.parse(localStorage.getItem('meu_estoque')) || [];
let vendas = JSON.parse(localStorage.getItem('minhas_vendas')) || [];
let carrinho = [];

// --- FUNÇÕES DA EMPRESA (painel.html) ---
function cadastrarProduto() {
    const nome = document.getElementById('p-nome').value;
    const preco = parseFloat(document.getElementById('p-preco').value);
    const qtd = parseInt(document.getElementById('p-estoque').value);
    const foto = document.getElementById('p-foto').value || "https://via.placeholder.com/150";

    if (!nome || !preco) return alert("Preencha Nome e Preço!");

    estoque.push({ id: Date.now(), nome, preco, qtd, foto });
    localStorage.setItem('meu_estoque', JSON.stringify(estoque));
    alert("Produto salvo!");
    location.reload();
}

// --- FUNÇÕES DO CLIENTE (index.html) ---
function carregarVitrine() {
    const vitrine = document.getElementById('vitrine-cliente');
    if (!vitrine) return;

    estoque.forEach(p => {
        if (p.qtd > 0) {
            vitrine.innerHTML += `
                <div class="produto-item">
                    <img src="${p.foto}">
                    <h4>${p.nome}</h4>
                    <p>R$ ${p.preco.toFixed(2)}</p>
                    <button onclick="adicionarCarrinho(${p.id})" class="btn-add-vitrine">Adicionar</button>
                </div>`;
        }
    });
}

function adicionarCarrinho(id) {
    const p = estoque.find(prod => prod.id === id);
    carrinho.push(p);
    atualizarCarrinho();
}

function atualizarCarrinho() {
    const lista = document.getElementById('lista-pedido');
    if (!lista) return;
    lista.innerHTML = '';
    let total = 0;
    carrinho.forEach(i => {
        total += i.preco;
        lista.innerHTML += `<li>${i.nome} <span>R$ ${i.preco.toFixed(2)}</span></li>`;
    });
    document.getElementById('total-pedido').innerText = `R$ ${total.toFixed(2)}`;
}

// Inicia as telas
carregarVitrine();
