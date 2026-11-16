const modalItem = document.getElementById('modal-item');
const formEstoque = document.getElementById('form-estoque');
const tbodyEstoque = document.getElementById('corpo-tabela-estoque');
const filtroCategoria = document.getElementById('filtro-categoria');
const campoPesquisa = document.getElementById('campo-pesquisa');
const ordemLista = document.getElementById('ordem-lista');
const btnExcluirItem = document.getElementById('btn-excluir-item');

let indexEditando = null;

document.getElementById('btn-abrir-modal').addEventListener('click', () => {
  indexEditando = null;
  formEstoque.reset();
  document.getElementById('modal-categoria').value = filtroCategoria.value;
  document.getElementById('titulo-modal').textContent = 'Incluir Novo item';
  btnExcluirItem.style.display = 'none';
  modalItem.style.display = 'flex';
});

document.getElementById('btn-fechar-modal').addEventListener('click', () => {
  modalItem.style.display = 'none';
});

function renderizarEstoque() {
  const itens = JSON.parse(localStorage.getItem('estoqueAumigos')) || [];
  const catSelecionada = filtroCategoria.value;
  const termo = campoPesquisa.value.toLowerCase();
  const ordem = ordemLista.value;

  let filtrados = itens
    .map((item, indexOriginal) => ({ ...item, indexOriginal }))
    .filter(item => item.categoria === catSelecionada && item.descricao.toLowerCase().includes(termo));

  if (ordem === 'crescente') {
    filtrados.sort((a, b) => a.descricao.localeCompare(b.descricao));
  } else if (ordem === 'decrescente') {
    filtrados.sort((a, b) => b.descricao.localeCompare(a.descricao));
  }

  tbodyEstoque.innerHTML = '';
  filtrados.forEach(item => {
    const tr = document.createElement('tr');
    tr.style.cursor = 'pointer';
    tr.title = 'Clique para editar ou excluir';
    tr.innerHTML = `
      <td>${item.idItem}</td>
      <td>${item.descricao}</td>
      <td>${item.quantidade}</td>
      <td>${item.valorUnd}</td>
    `;
    tr.addEventListener('click', () => abrirEdicaoItem(item.indexOriginal));
    tbodyEstoque.appendChild(tr);
  });
}

function abrirEdicaoItem(index) {
  const itens = JSON.parse(localStorage.getItem('estoqueAumigos')) || [];
  const item = itens[index];
  if (!item) return;

  indexEditando = index;
  document.getElementById('titulo-modal').textContent = 'Editar Item';
  formEstoque.elements['categoria'].value = item.categoria;
  formEstoque.elements['idItem'].value = item.idItem;
  formEstoque.elements['descricao'].value = item.descricao;
  formEstoque.elements['quantidade'].value = item.quantidade;
  formEstoque.elements['valorPago'].value = item.valorPago;
  formEstoque.elements['valorUnd'].value = item.valorUnd;
  formEstoque.elements['dataEntrada'].value = item.dataEntrada;
  formEstoque.elements['dataValidade'].value = item.dataValidade;

  btnExcluirItem.style.display = 'inline-block';
  modalItem.style.display = 'flex';
}

formEstoque.addEventListener('submit', (e) => {
  e.preventDefault();
  const dados = new FormData(formEstoque);
  const itens = JSON.parse(localStorage.getItem('estoqueAumigos')) || [];

  const novoItem = {
    categoria: dados.get('categoria'),
    idItem: dados.get('idItem'),
    descricao: dados.get('descricao'),
    quantidade: dados.get('quantidade'),
    valorPago: dados.get('valorPago'),
    valorUnd: dados.get('valorUnd'),
    dataEntrada: dados.get('dataEntrada'),
    dataValidade: dados.get('dataValidade')
  };

  if (indexEditando !== null) {
    itens[indexEditando] = novoItem;
  } else {
    itens.push(novoItem);
  }

  localStorage.setItem('estoqueAumigos', JSON.stringify(itens));
  modalItem.style.display = 'none';
  renderizarEstoque();
});

btnExcluirItem.addEventListener('click', () => {
  if (indexEditando !== null && confirm('Deseja excluir este item do estoque?')) {
    const itens = JSON.parse(localStorage.getItem('estoqueAumigos')) || [];
    itens.splice(indexEditando, 1);
    localStorage.setItem('estoqueAumigos', JSON.stringify(itens));
    modalItem.style.display = 'none';
    renderizarEstoque();
  }
});

filtroCategoria.addEventListener('change', renderizarEstoque);
campoPesquisa.addEventListener('input', renderizarEstoque);
ordemLista.addEventListener('change', renderizarEstoque);

function abrirTelaFinanceira(event) {
  event.preventDefault();
  const perfil = localStorage.getItem('perfilLogado');
  window.location.href = perfil === 'secretaria' ? '../recursos-emergenciais/index.html' : '../dashboard-financeiro/index.html';
}

window.addEventListener('DOMContentLoaded', renderizarEstoque);
