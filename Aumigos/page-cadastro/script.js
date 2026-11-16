const form = document.getElementById('form-cadastro');
const editIndex = localStorage.getItem('animalEditandoIndex');

window.addEventListener('DOMContentLoaded', function() {
  if (editIndex !== null && form) {
    const listaAnimais = JSON.parse(localStorage.getItem('animaisCadastrados')) || [];
    const animal = listaAnimais[editIndex];

    if (animal && animal.todosCampos) {
      Object.keys(animal.todosCampos).forEach(function(nomeCampo) {
        const elementos = form.querySelectorAll(`[name="${nomeCampo}"]`);
        const valorSalvo = animal.todosCampos[nomeCampo];

        elementos.forEach(function(el) {
          if (el.type === 'checkbox') {
            el.checked = Array.isArray(valorSalvo) ? valorSalvo.includes(el.value) : Boolean(valorSalvo);
          } else if (el.type === 'radio') {
            el.checked = (el.value === valorSalvo);
          } else if (el.type !== 'file') {
            el.value = valorSalvo;
          }
        });
      });
    }
  }

  const linksVoltar = document.querySelectorAll('.botao-fechar, .link-icone, a[href*="cadrastados"]');
  linksVoltar.forEach(function(link) {
    link.addEventListener('click', function() {
      localStorage.removeItem('animalEditandoIndex');
    });
  });
});

function comprimirImagem(arquivo, callback) {
  const leitor = new FileReader();
  leitor.onload = function(event) {
    const img = new Image();
    img.onload = function() {
      const canvas = document.createElement('canvas');
      const maxLargura = 300;
      const escala = maxLargura / img.width;
      canvas.width = maxLargura;
      canvas.height = img.height * escala;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const imagemLeve = canvas.toDataURL('image/jpeg', 0.7);
      callback(imagemLeve);
    };
    img.src = event.target.result;
  };
  leitor.readAsDataURL(arquivo);
}

if (form) {
  form.addEventListener('submit', function(event) {
    event.preventDefault();

    const dados = new FormData(form);
    const inputFoto = form.querySelector('input[type="file"]');
    const arquivoFoto = inputFoto && inputFoto.files && inputFoto.files[0] ? inputFoto.files[0] : null;
    const listaAnimais = JSON.parse(localStorage.getItem('animaisCadastrados')) || [];

    const todosCampos = {};
    dados.forEach(function(valor, chave) {
      if (chave === 'foto') return;
      if (todosCampos[chave] !== undefined) {
        if (!Array.isArray(todosCampos[chave])) {
          todosCampos[chave] = [todosCampos[chave]];
        }
        todosCampos[chave].push(valor);
      } else {
        todosCampos[chave] = valor;
      }
    });

    const textoObservacao = dados.get('observacoes') || dados.get('comportamento') || dados.get('observacao') || '';

    function finalizarSalvamento(imagemFinal) {
      const statusAtual = (dados.get('status') || 'EM ADOÇÃO').toUpperCase();
      const animalAntigo = (editIndex !== null && listaAnimais[editIndex]) ? listaAnimais[editIndex] : null;

      let dataAdocao = null;
      if (statusAtual === 'ADOTADO') {
        dataAdocao = (animalAntigo && animalAntigo.dataAdocao) ? animalAntigo.dataAdocao : new Date().toISOString();
      }

      const dadosAnimal = {
        nome: (dados.get('nome') || 'SEM NOME').toUpperCase(),
        especie: dados.get('especie') || '',
        idade: dados.get('idade') || '',
        raca: dados.get('raca') || '',
        sexo: dados.get('sexo') || '',
        status: statusAtual,
        dataAdocao: dataAdocao,
        observacoes: textoObservacao,
        foto: imagemFinal,
        todosCampos: todosCampos
      };

      try {
        if (editIndex !== null) {
          listaAnimais[editIndex] = dadosAnimal;
          localStorage.removeItem('animalEditandoIndex');
        } else {
          listaAnimais.push(dadosAnimal);
        }

        localStorage.setItem('animaisCadastrados', JSON.stringify(listaAnimais));
        window.location.href = '../cadrastados/index.html';
      } catch (erro) {
        alert('Erro ao salvar: a memória do navegador está cheia. Tente usar uma foto menor ou limpar os cadastros antigos.');
        console.error(erro);
      }
    }

    if (arquivoFoto) {
      comprimirImagem(arquivoFoto, finalizarSalvamento);
    } else {
      const fotoAntiga = (editIndex !== null && listaAnimais[editIndex]) ? listaAnimais[editIndex].foto : 'logo-aumigos.png';
      finalizarSalvamento(fotoAntiga);
    }
  });
}

const btnExcluir = document.getElementById('btn-excluir');

if (editIndex !== null && btnExcluir) {
  btnExcluir.style.display = 'inline-block';

  btnExcluir.addEventListener('click', function() {
    if (confirm('Tem certeza que deseja excluir este pet?')) {
      const listaAnimais = JSON.parse(localStorage.getItem('animaisCadastrados')) || [];
      
      listaAnimais.splice(editIndex, 1); 
      
      localStorage.setItem('animaisCadastrados', JSON.stringify(listaAnimais));
      localStorage.removeItem('animalEditandoIndex');
      
      window.location.href = '../cadrastados/index.html';
    }
  });
}
