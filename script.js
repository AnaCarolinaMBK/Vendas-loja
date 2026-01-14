const form = document.getElementById('venda-form');
let vendas = JSON.parse(localStorage.getItem('vendas_loja')) || [];

function atualizar() {
    const lista = document.getElementById('lista-vendas');
    lista.innerHTML = '';
    let totalGeral = 0;

    vendas.forEach(v => {
        const sub = v.qtd * v.valor;
        totalGeral += sub;
        lista.innerHTML += `<tr><td>${v.item}</td><td>R$ ${sub.toFixed(2)}</td><td>${v.data}</td></tr>`;
    });
    document.getElementById('faturamento').innerText = `R$ ${totalGeral.toFixed(2)}`;
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    vendas.push({
        item: document.getElementById('produto').value,
        qtd: document.getElementById('qtd').value,
        valor: document.getElementById('valor').value,
        data: new Date().toLocaleDateString('pt-BR')
    });
    localStorage.setItem('vendas_loja', JSON.stringify(vendas));
    atualizar();
    form.reset();
});

function exportarSheets() {
    let csv = "Produto,Quantidade,Preco,Data\n";
    vendas.forEach(v => { csv += `${v.item},${v.qtd},${v.valor},${v.data}\n`; });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vendas.csv';
    a.click();
}
atualizar();

