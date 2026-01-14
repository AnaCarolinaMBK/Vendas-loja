let carrinho = [];
let historicoVendas = JSON.parse(localStorage.getItem('vendas_loja')) || [];

function adicionarAoCarrinho() {
    const item = document.getElementById('produto').value;
    const qtd = parseInt(document.getElementById('qtd').value);
    const valor = parseFloat(document.getElementById('valor').value);

    if (!item || !qtd || !valor) return alert("Preencha todos os campos!");

    carrinho.push({ item, qtd, valor, subtotal: qtd * valor });
    atualizarInterfaceCarrinho();
    
    document.getElementById('produto').value = '';
    document.getElementById('valor').value = '';
}

function atualizarInterfaceCarrinho() {
    const lista = document.getElementById('itens-carrinho');
    const card = document.getElementById('card-carrinho');
    lista.innerHTML = '';
    let soma = 0;

    if (carrinho.length > 0) card.style.display = 'block';

    carrinho.forEach((p) => {
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

    historicoVendas.unshift(vendaFinal); 
    localStorage.setItem('vendas_loja', JSON.stringify(historicoVendas));
    
    carrinho = []; 
    document.getElementById('card-carrinho').style.display = 'none';
    mostrarHistorico();
    alert("Venda registrada com sucesso!");
}

function mostrarHistorico() {
    const div = document.getElementById('historico-lista');
    div.innerHTML = '';
    let faturamentoAcumulado = 0; 
    
    historicoVendas.forEach((v, index) => {
        faturamentoAcumulado += v.total;
        div.innerHTML += `
            <div class="venda-bloco">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <strong>📅 ${v.data}</strong>
                    <button onclick="excluirVenda(${index})" class="btn-excluir">❌ Apagar</button>
                </div>
                <p style="margin: 10px 0;">${v.itens.map(i => `${i.qtd}x ${i.item}`).join(', ')}</p>
                <strong>💰 Total: R$ ${v.total.toFixed(2)}</strong>
            </div>
        `;
    });

    document.getElementById('faturamento-total').innerText = `Faturamento Geral: R$ ${faturamentoAcumulado.toFixed(2)}`;
}

function excluirVenda(index) {
    if (confirm("Deseja realmente excluir esta venda do histórico? Isso alterará seu faturamento total.")) {
        historicoVendas.splice(index, 1);
        localStorage.setItem('vendas_loja', JSON.stringify(historicoVendas));
        mostrarHistorico();
    }
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
    a.download = 'relatorio_vendas.csv';
    a.click();
}

mostrarHistorico();
