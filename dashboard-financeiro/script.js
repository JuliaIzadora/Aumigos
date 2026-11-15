const tbodyDona = document.getElementById('tabela-pedidos-dona');

function carregarPedidosDona() {
  if (!tbodyDona) return;
  const pedidos = JSON.parse(localStorage.getItem('pedidosEmergenciais')) || [];
  tbodyDona.innerHTML = '';

  if (pedidos.length === 0) {
    tbodyDona.innerHTML = '<tr><td colspan="4" style="text-align:center; color:#777;">Nenhum pedido emergencial recebido.</td></tr>';
    return;
  }

  pedidos.forEach((pedido, index) => {
    const dataFormatada = pedido.data ? pedido.data.split('-').reverse().join('/') : '-';
    
    let colunaSituacao = '';
    if (pedido.situacao === 'Aguardando') {
      colunaSituacao = `
        <button type="button" onclick="mudarStatusPedido(${index}, 'Aprovado')" style="background:#b8cb73; color:#fff; border:none; border-radius:8px; padding:5px 12px; cursor:pointer; font-weight:bold; margin-right:5px;">Aprovar</button>
        <button type="button" onclick="mudarStatusPedido(${index}, 'Recusado')" style="background:#d9534f; color:#fff; border:none; border-radius:8px; padding:5px 12px; cursor:pointer; font-weight:bold;">Recusar</button>
      `;
    } else {
      const cor = pedido.situacao === 'Aprovado' ? '#7a9a2e' : '#d9534f';
      colunaSituacao = `<strong style="color:${cor};">${pedido.situacao}</strong>`;
    }

    const linha = `
      <tr title="Motivo: ${pedido.motivo} (${pedido.tipo})">
        <td>${pedido.responsavel}</td>
        <td>${dataFormatada}</td>
        <td>${pedido.valor}</td>
        <td>${colunaSituacao}</td>
      </tr>
    `;
    tbodyDona.insertAdjacentHTML('beforeend', linha);
  });
}

function mudarStatusPedido(index, novoStatus) {
  const pedidos = JSON.parse(localStorage.getItem('pedidosEmergenciais')) || [];
  if (pedidos[index]) {
    pedidos[index].situacao = novoStatus;
    localStorage.setItem('pedidosEmergenciais', JSON.stringify(pedidos));
    carregarPedidosDona();
  }
}

window.addEventListener('DOMContentLoaded', carregarPedidosDona);
