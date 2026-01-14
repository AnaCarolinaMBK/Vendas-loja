let carrinho = [];
let historicoVendas = JSON.parse(localStorage.getItem('vendas_loja')) || [];

function adicionarAoCarrinho() {
    const item = document.getElementById('produto').value;
    const qtd = parseInt(document.getElementById('qtd').value);
    const valor = parseFloat(document.getElementById('valor').value);

    if (!item || !qtd || !valor) return alert("Preencha todos os campos!");

    carrinho.push({ item, qtd, valor, subtotal: qtd * valor });
    atualizarInterfaceCarrinho();
    
    // Limpa campos para o próximo item
    document.getElementById('produto').value = '';
    document.getElementById('valor').value = '';
}

function atualizarInterfaceCarrinho() {
    const lista = document.getElementById('itens-carrinho');
    const card = document.getElementById('card-carrinho');
    lista.innerHTML = '';
    let soma = 0;

    if (carrinho.length > 0) card.style.display = 'block';

    carrinho.forEach((p, index) => {
        soma += p.subtotal;
        lista.innerHTML += `<li>${p.qtd}x ${p.item} <span>R$ ${p.subtotal.toFixed(2)}</span></li>`;
    });

    document.getElementById('subtotal-venda').innerText = `R$ ${soma.toFixed(2)}`;
}

function finalizarVenda() {
    const vendaFinal = {
        data: new Date().toLocaleString('pt-BR'),
        itens: [...carrinho],
        total: carrinho.reduce((acc, p) => acc + p.subtotal, 0)
    };

    historicoVendas.unshift(vendaFinal); // Adiciona no topo da lista
    localStorage.setItem('vendas_loja', JSON.stringify(historicoVendas));
    
    carrinho = []; // Limpa o carrinho
    document.getElementById('card-carrinho').style.display = 'none';
    mostrarHistorico();
    alert("Venda registrada com sucesso!");
}

function mostrarHistorico() {
    const div = document.getElementById('historico-lista');
    div.innerHTML = '';
    
    historicoVendas.forEach(v => {
        div.innerHTML += `
            <div class="venda-bloco">
                <strong>Data: ${v.data}</strong><br>
                ${v.itens.map(i => `${i.qtd}x ${i.item}`).join(', ')}<br>
                <strong>Total: R$ ${v.total.toFixed(2)}</strong>
            </div>
        `;
    });
}

function exportarSheets() {
    let csv = "Data,Produtos,Valor Total\n";
    historicoVendas.forEach(v => {
        const nomes = v.itens.map(i => `${i.qtd}x ${i.item}`).join(' | ');
        csv += `${v.data},${nomes},${v.total.toFixed(2)}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vendas_detalhadas.csv';
    a.click();
}

mostrarHistorico();
