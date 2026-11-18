const cpfsCadastrados = {
    dona: '16565935050',
    secretaria: '61546118039'
};

let perfilEncontrado = null;

// Seleção dos elementos do HTML
const inputCpf = document.getElementById('cpf');
const formCpf = document.getElementById('form-cpf');
const formNovaSenha = document.getElementById('form-nova-senha');
const mensagem = document.getElementById('mensagem');
const instrucao = document.getElementById('instrucao');

// 1. Máscara automática de CPF (000.000.000-00)
inputCpf.addEventListener('input', (e) => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 11);
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
    v = v.replace(/(\d{3})\.(\d{3})\.(\d{3})(\d{1,2})$/, '$1.$2.$3-$4');
    e.target.value = v;
});

// 2. Validação do CPF (Etapa 1)
formCpf.addEventListener('submit', (e) => {
    e.preventDefault();
    const cpfLimpo = inputCpf.value.replace(/\D/g, '');
    mensagem.textContent = '';

    if (cpfLimpo === cpfsCadastrados.dona) {
        perfilEncontrado = 'dona';
    } else if (cpfLimpo === cpfsCadastrados.secretaria) {
        perfilEncontrado = 'secretaria';
    } else {
        mensagem.textContent = 'CPF não encontrado no sistema.';
        mensagem.className = 'mensagem erro';
        return;
    }

    // Esconde o formulário de CPF e mostra o de nova senha
    formCpf.classList.add('escondido');
    formNovaSenha.classList.remove('escondido');
    
    const nomePerfil = perfilEncontrado === 'dona' ? 'Dona' : 'Secretária';
    instrucao.textContent = `Perfil identificado (${nomePerfil}). Crie sua nova senha:`;
});

// 3. Salvamento da Nova Senha (Etapa 2)
formNovaSenha.addEventListener('submit', (e) => {
    e.preventDefault();
    const novaSenha = document.getElementById('nova-senha').value.trim();
    const confirmarSenha = document.getElementById('confirmar-senha').value.trim();

    if (novaSenha.length < 4) {
        mensagem.textContent = 'A senha deve ter pelo menos 4 caracteres.';
        mensagem.className = 'mensagem erro';
        return;
    }

    if (novaSenha !== confirmarSenha) {
        mensagem.textContent = 'As senhas não coincidem.';
        mensagem.className = 'mensagem erro';
        return;
    }

    // Salva a nova senha no navegador (localStorage)
    if (perfilEncontrado === 'dona') {
        localStorage.setItem('senha_dona', novaSenha);
    } else if (perfilEncontrado === 'secretaria') {
        localStorage.setItem('senha_sec', novaSenha);
    }

    mensagem.textContent = 'Senha alterada com sucesso! Redirecionando...';
    mensagem.className = 'mensagem sucesso';

    // Redireciona para a página de login após 1,5 segundos
    setTimeout(() => {
        window.location.href = '../page-login/index.html';
    }, 1500);
});