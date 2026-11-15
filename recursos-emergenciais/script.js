const formEmergencia = document.getElementById('form-emergencia');
const tbodySec = document.getElementById('tabela-historico-sec');

function carregarHistoricoSecretaria() {
  if (!tbodySec) return;
  const pedidos = JSON.parse(localStorage.getItem('pedidosEmergenciais')) || [];
  tbodySec.innerHTML = '';

  if (pedidos.length === 0) {
    tbodySec.innerHTML = '<tr><td colspan="4" style="text-align:center; color:#777;">Nenhum pedido registrado ainda.</td></tr>';
    return;
  }

  pedidos.forEach(pedido => {
    const dataFormatada = pedido.data ? pedido.data.split('-').reverse().join('/') : '-';
    const cor = pedido.situacao === 'Aprovado' ? '#7a9a2e' : (pedido.situacao === 'Recusado' ? '#d9534f' : '#d35400');

    const tr = `
      <tr>
        <td>${pedido.responsavel}</td>
        <td>${dataFormatada}</td>
        <td>${pedido.valor}</td>
        <td><strong style="color:${cor};">${pedido.situacao}</strong></td>
      </tr>
    `;
    tbodySec.insertAdjacentHTML('beforeend', tr);
  });
}

if (formEmergencia) {
  formEmergencia.addEventListener('submit', function(e) {
    e.preventDefault();
    const dados = new FormData(formEmergencia);

    const novoPedido = {
      tipo: dados.get('tipo') || 'Solicitação',
      motivo: dados.get('motivo') || '',
      responsavel: dados.get('responsavel') || 'Secretária',
      valor: dados.get('valor') || 'R$ 0,00',
      data: dados.get('data') || '',
      situacao: 'Aguardando'
    };

    const pedidos = JSON.parse(localStorage.getItem('pedidosEmergenciais')) || [];
    pedidos.unshift(novoPedido);
    localStorage.setItem('pedidosEmergenciais', JSON.stringify(pedidos));

    formEmergencia.reset();
    carregarHistoricoSecretaria();
    alert('Pedido enviado para a proprietária com sucesso!');
  });
}

window.addEventListener('DOMContentLoaded', carregarHistoricoSecretaria);
