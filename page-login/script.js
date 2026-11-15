const formLogin = document.getElementById('form-login');

if (formLogin) {
  formLogin.addEventListener('submit', function(event) {
    event.preventDefault();

    const perfil = formLogin.getAttribute('data-perfil');
    const campoSenha = formLogin.querySelector('.input-password');
    const senha = campoSenha.value.trim();

    if (perfil === 'dona') {
      if (senha === 'dona123') {
        localStorage.setItem('perfilLogado', 'dona');
        window.location.href = '../cadrastados/index.html';
      } else {
        alert('Senha da proprietária incorreta!');
        campoSenha.value = '';
      }
    } 
    else if (perfil === 'secretaria') {
      if (senha === 'sec123') {
        localStorage.setItem('perfilLogado', 'secretaria');
        window.location.href = '../cadrastados/index.html'; 
      } else {
        alert('Senha da secretária incorreta!');
        campoSenha.value = '';
      }
    }
  });
}
