let estoque = JSON.parse(localStorage.getItem('estoque_db')) || [];
let carrinho = [];

// CADASTRO (Empresa)
function cadastrarProduto() {
    const nome = document.getElementById('p-nome').value;
    const preco = parseFloat(document.getElementById('p-preco').value);
    const loja = parseInt(document.getElementById('p-loja').value);
    const reserva = parseInt(document.getElementById('p-reserva').value);
    const foto = document.getElementById('p-foto').value || "sem-foto.jpg";

    estoque.push({ id: Date.now(), nome, preco, loja, reserva, foto });
    localStorage.setItem('estoque_db', JSON.stringify(estoque));
    location.reload();
}

// VITRINE (Cliente)
function carregarLoja() {
    const vitrine = document.getElementById('vitrine-cliente');
    if (!vitrine) return;
    estoque.forEach(p => {
        if (p.loja > 0) {
            vitrine.innerHTML += `
                <div class="produto-card">
                    <img src="${p.foto}">
                    <div class="info">
                        <strong>${p.nome}</strong>
                        <p class="preco">R$ ${p.preco.toFixed(2)}</p>
                        <button id="btn-${p.id}" onclick="marcarItem(${p.id})" class="btn-selecionar">Selecionar</button>
                    </div>
                </div>`;
        }
    });
}

// CARRINHO FLUTUANTE
function marcarItem(id) {
    const btn = document.getElementById(`btn-${id}`);
    const p = estoque.find(item => item.id === id);
    const index = carrinho.findIndex(c => c.id === id);

    if (index > -1) {
        carrinho.splice(index, 1);
        btn.classList.remove('ativo');
        btn.innerText = "Selecionar";
    } else {
        carrinho.push(p);
        btn.classList.add('ativo');
        btn.innerText = "✅ Marcado";
    }
    atualizarTotal();
}

function atualizarTotal() {
    const bar = document.getElementById('carrinho-flutuante');
    const total = carrinho.reduce((sum, item) => sum + item.preco, 0);
    if (carrinho.length > 0) {
        bar.style.display = 'block';
        document.getElementById('total-flutuante').innerText = `R$ ${total.toFixed(2)}`;
    } else {
        bar.style.display = 'none';
    }
}

// INICIALIZAÇÃO
carregarLoja();
if (document.getElementById('tabela-comparativa')) desenharTabela();

function desenharTabela() {
    const tbody = document.getElementById('tabela-comparativa');
    estoque.forEach(p => {
        tbody.innerHTML += `<tr>
            <td>${p.nome}</td>
            <td class="col-venda">${p.loja}</td>
            <td class="col-reserva">${p.reserva}</td>
            <td><button onclick="excluir(${p.id})">🗑️</button></td>
        </tr>`;
    });
}
