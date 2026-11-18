const formLogin = document.getElementById('form-login');

if (formLogin) {
  formLogin.addEventListener('submit', function(event) {
    event.preventDefault();

    const perfil = formLogin.getAttribute('data-perfil');
    const campoSenha = formLogin.querySelector('.input-password');
    const senha = campoSenha.value.trim();

    // Define senhas padrão ou busca se o usuário já alterou e salvou no localStorage
    let senhaDonaCorreta = localStorage.getItem('senha_dona') || 'dona123';
    let senhaSecCorreta = localStorage.getItem('senha_sec') || 'sec123';

    if (perfil === 'dona') {
      if (senha === senhaDonaCorreta) {
        localStorage.setItem('perfilLogado', 'dona');
        window.location.href = '../cadrastados/index.html';
      } else {
        alert('Senha da proprietária incorreta!');
        campoSenha.value = '';
      }
    } 
    else if (perfil === 'secretaria') {
      if (senha === senhaSecCorreta) {
        localStorage.setItem('perfilLogado', 'secretaria');
        window.location.href = '../cadrastados/index.html'; 
      } else {
        alert('Senha da secretária incorreta!');
        campoSenha.value = '';
      }
    }
  });
}