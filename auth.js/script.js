const perfilAtual = localStorage.getItem('perfilLogado');
const caminhoPagina = window.location.pathname;

if (!perfilAtual && !caminhoPagina.includes('page-login')) {
  window.location.href = '../page-login/index.html';
}

if (perfilAtual === 'dona' && caminhoPagina.includes('recursos-emergenciais')) {
  window.location.href = '../dashboard-financeiro/index.html';
}

if (perfilAtual === 'secretaria' && caminhoPagina.includes('dashboard-financeiro')) {
  window.location.href = '../recursos-emergenciais/index.html';
}

function abrirTelaFinanceira(event) {
  if (event) event.preventDefault();
  
  const destino = (perfilAtual === 'secretaria') 
    ? 'recursos-emergenciais/index.html' 
    : 'dashboard-financeiro/index.html';

  const pastasConhecidas = ['cadrastados', 'page-cadastro', 'controle-estoque', 'controle-pessoas', 'dashboard-financeiro', 'recursos-emergenciais'];
  const estaEmSubpasta = pastasConhecidas.some(pasta => window.location.pathname.includes('/' + pasta + '/'));

  window.location.href = estaEmSubpasta ? '../' + destino : destino;
}

function sairDoSistema(event) {
  if (event) event.preventDefault();
  localStorage.removeItem('perfilLogado');
  window.location.href = '../page-login/index.html';
}
