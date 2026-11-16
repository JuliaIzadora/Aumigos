const modalPessoa = document.getElementById('modal-pessoa');
const formPessoa = document.getElementById('form-pessoa');
const tbodyPessoas = document.getElementById('corpo-tabela-pessoas');
const filtroTipoPessoa = document.getElementById('filtro-tipo-pessoa');
const colunaDocumento = document.getElementById('coluna-documento');
const pesquisaPessoa = document.getElementById('pesquisa-pessoa');
const ordemPessoas = document.getElementById('ordem-pessoas');
const btnExcluirPessoa = document.getElementById('btn-excluir-pessoa');

let pessoaEditandoIndex = null;

document.getElementById('btn-nova-pessoa').addEventListener('click', () => {
  pessoaEditandoIndex = null;
  formPessoa.reset();
  document.getElementById('status-anexo').textContent = '';
  document.getElementById('modal-tipo-pessoa').value = filtroTipoPessoa.value;
  document.getElementById('titulo-modal-pessoa').textContent = 'Incluir Novo Cadastro';
  btnExcluirPessoa.style.display = 'none';
  modalPessoa.style.display = 'flex';
});

document.getElementById('btn-fechar-pessoa').addEventListener('click', () => {
  modalPessoa.style.display = 'none';
});

function renderizarPessoas() {
  const pessoas = JSON.parse(localStorage.getItem('pessoasAumigos')) || [];
  const tipoAtual = filtroTipoPessoa.value;
  const termo = pesquisaPessoa.value.toLowerCase();
  const ordem = ordemPessoas.value;

  const isFornecedor = (tipoAtual === 'FORNECEDORES');
  colunaDocumento.textContent = isFornecedor ? 'CNPJ' : 'CPF';

  let filtrados = pessoas
    .map((p, indexOriginal) => ({ ...p, indexOriginal }))
    .filter(p => p.tipoCadastro === tipoAtual && p.nome.toLowerCase().includes(termo));

  if (ordem === 'crescente') {
    filtrados.sort((a, b) => a.nome.localeCompare(b.nome));
  } else if (ordem === 'decrescente') {
    filtrados.sort((a, b) => b.nome.localeCompare(a.nome));
  }

  tbodyPessoas.innerHTML = '';
  filtrados.forEach(p => {
    const tr = document.createElement('tr');
    tr.style.cursor = 'pointer';
    tr.title = 'Clique para editar ou excluir';

    const documentoExibido = isFornecedor ? (p.cnpj || '-') : (p.cpf || '-');

    tr.innerHTML = `
      <td>${p.nome}</td>
      <td>${p.telefone}</td>
      <td>${documentoExibido}</td>
      <td>${p.endereco || '-'}</td>
    `;
    tr.addEventListener('click', () => abrirEdicaoPessoa(p.indexOriginal));
    tbodyPessoas.appendChild(tr);
  });
}

function abrirEdicaoPessoa(index) {
  const pessoas = JSON.parse(localStorage.getItem('pessoasAumigos')) || [];
  const p = pessoas[index];
  if (!p) return;

  pessoaEditandoIndex = index;
  document.getElementById('titulo-modal-pessoa').textContent = 'Editar Cadastro';
  formPessoa.elements['nome'].value = p.nome;
  formPessoa.elements['telefone'].value = p.telefone;
  formPessoa.elements['cpf'].value = p.cpf || '';
  formPessoa.elements['cnpj'].value = p.cnpj || '';
  formPessoa.elements['endereco'].value = p.endereco || '';
  formPessoa.elements['tipoCadastro'].value = p.tipoCadastro;
  document.getElementById('status-anexo').textContent = p.nomeArquivoAtestado ? `Arquivo: ${p.nomeArquivoAtestado}` : '';

  btnExcluirPessoa.style.display = 'inline-block';
  modalPessoa.style.display = 'flex';
}

formPessoa.addEventListener('submit', (e) => {
  e.preventDefault();
  const dados = new FormData(formPessoa);
  const pessoas = JSON.parse(localStorage.getItem('pessoasAumigos')) || [];
  const inputArquivo = formPessoa.querySelector('input[name="atestado"]');
  const nomeArquivo = (inputArquivo && inputArquivo.files[0]) ? inputArquivo.files[0].name : (pessoaEditandoIndex !== null ? pessoas[pessoaEditandoIndex].nomeArquivoAtestado : '');

  const novaPessoa = {
    nome: dados.get('nome'),
    telefone: dados.get('telefone'),
    cpf: dados.get('cpf'),
    cnpj: dados.get('cnpj'),
    endereco: dados.get('endereco'),
    tipoCadastro: dados.get('tipoCadastro'),
    nomeArquivoAtestado: nomeArquivo
  };

  if (pessoaEditandoIndex !== null) {
    pessoas[pessoaEditandoIndex] = novaPessoa;
  } else {
    pessoas.push(novaPessoa);
  }

  localStorage.setItem('pessoasAumigos', JSON.stringify(pessoas));
  modalPessoa.style.display = 'none';
  renderizarPessoas();
});

btnExcluirPessoa.addEventListener('click', () => {
  if (pessoaEditandoIndex !== null && confirm('Deseja excluir este cadastro?')) {
    const pessoas = JSON.parse(localStorage.getItem('pessoasAumigos')) || [];
    pessoas.splice(pessoaEditandoIndex, 1);
    localStorage.setItem('pessoasAumigos', JSON.stringify(pessoas));
    modalPessoa.style.display = 'none';
    renderizarPessoas();
  }
});

filtroTipoPessoa.addEventListener('change', renderizarPessoas);
pesquisaPessoa.addEventListener('input', renderizarPessoas);
ordemPessoas.addEventListener('change', renderizarPessoas);

function abrirTelaFinanceira(event) {
  event.preventDefault();
  const perfil = localStorage.getItem('perfilLogado');
  window.location.href = perfil === 'secretaria' ? '../recursos-emergenciais/index.html' : '../dashboard-financeiro/index.html';
}

window.addEventListener('DOMContentLoaded', renderizarPessoas);

const inputTelefone = formPessoa.elements['telefone'];
const inputCpf = formPessoa.elements['cpf'];
const inputCnpj = formPessoa.elements['cnpj'];

inputTelefone.addEventListener('input', function(e) {
  let v = e.target.value.replace(/\D/g, '');
  v = v.replace(/^(\d{2})(\d)/g, '($1) $2');
  v = v.replace(/(\d)(\d{4})$/, '$1-$2');
  e.target.value = v;
});

inputCpf.addEventListener('input', function(e) {
  let v = e.target.value.replace(/\D/g, '');
  v = v.replace(/(\d{3})(\d)/, '$1.$2');
  v = v.replace(/(\d{3})(\d)/, '$1.$2');
  v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  e.target.value = v;
});

inputCnpj.addEventListener('input', function(e) {
  let v = e.target.value.replace(/\D/g, '');
  v = v.replace(/^(\d{2})(\d)/, '$1.$2');
  v = v.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
  v = v.replace(/\.(\d{3})(\d)/, '.$1/$2');
  v = v.replace(/(\d{4})(\d)/, '$1-$2');
  e.target.value = v;
});
