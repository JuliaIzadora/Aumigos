window.addEventListener('DOMContentLoaded', function() {
  const listaSection = document.querySelector('.pets-list');
  const animaisSalvos = JSON.parse(localStorage.getItem('animaisCadastrados')) || [];

  animaisSalvos.forEach(function(animal, index) {
    
    const isAdotado = (animal.status || '').toUpperCase() === 'ADOTADO';
    const classeTexto = isAdotado ? 'status-adopted' : 'status-adoption';
    const classeBorda = isAdotado ? 'card-adopted' : 'card-adoption';

    const novoCard = `
      <article class="pet-card ${classeBorda}" onclick="editarAnimal(${index})" style="cursor: pointer;">
        <img src="${animal.foto}" alt="Foto do ${animal.nome}" class="pet-avatar">

        <div class="pet-info-grid">
          <div class="pet-header">
            <h2 class="pet-name ${classeTexto}">${animal.nome} • ${animal.status}</h2>
            <button type="button" class="edit-btn" title="Editar">
              <ion-icon name="pencil-outline"></ion-icon>
            </button>
          </div>

          <div class="pet-details">
            <div class="info-block">
              <p><strong>${animal.idade}</strong></p>
              <p class="sub-label">${animal.especie}</p>
            </div>
            <div class="info-block divider">
              <p><strong>${animal.sexo}</strong></p>
              <p class="sub-label">${animal.raca}</p>
            </div>
            <div class="info-block description">
              <p>${animal.observacoes}</p>
            </div>
          </div>
        </div>
      </article>
    `;

    listaSection.insertAdjacentHTML('beforeend', novoCard);
  });
});

function editarAnimal(index) {
  localStorage.setItem('animalEditandoIndex', index);
  window.location.href = '../page-cadastro/index.html';
}

function abrirTelaFinanceira(event) {
  event.preventDefault();
  const perfil = localStorage.getItem('perfilLogado');

  if (perfil === 'secretaria') {
    window.location.href = '../recursos-emergenciais/index.html';
  } else {

    window.location.href = '../dashboard-financeiro/index.html';
  }
}

