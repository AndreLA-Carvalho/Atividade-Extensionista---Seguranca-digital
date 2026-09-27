// Aguarda o HTML carregar completamente antes de executar os scripts
document.addEventListener('DOMContentLoaded', function() {
    
    /* ===========================
       ======= TEMA ESCURO =======
       =========================== */

    const btnTema = document.getElementById('toggleTheme');
    const themeIcon = document.getElementById('themeIcon');
    const html = document.documentElement;

    // Ícones SVG utilizados no botão de troca de tema
    const moonIcon = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>';
    const sunIcon = '<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>';

    function setTema(tema) {
        if (tema === 'dark') {
            html.classList.add('dark-mode');
            if (themeIcon) themeIcon.innerHTML = sunIcon;
        } else {
            html.classList.remove('dark-mode');
            if (themeIcon) themeIcon.innerHTML = moonIcon;
        }
    }

    // Inicializa o tema baseado na escolha anterior do usuário salva no cache
    const temaSalvo = localStorage.getItem('tema');
    setTema(temaSalvo);

    // Evento de clique para trocar o tema
    if (btnTema) {
        btnTema.addEventListener('click', () => {
            const isDark = html.classList.toggle('dark-mode');
            const novoTema = isDark ? 'dark' : 'light';
            localStorage.setItem('tema', novoTema);
            setTema(novoTema);
        });
    }

    /* ===========================
       ===== FLUXO DE ACESSO =====
       =========================== */

    const btnAcessar = document.getElementById('btnAcessar');
    const nomeInput = document.getElementById('nomeUsuario');
    const statusMsg = document.getElementById('msg-status');
    const telaLogin = document.getElementById('tela-login');
    const telaConteudo = document.getElementById('tela-conteudo');
    const erroMsg = document.getElementById('erro-nome'); 
    const navbar = document.getElementById('main-navbar');

    // Verifica se o usuário já fez o registro nesta sessão.
    // Se ele voltar de uma das páginas de dicas para o index.html, ele pula o login.
    if (telaLogin && telaConteudo) {
        if (sessionStorage.getItem('acessoRegistrado') === 'sim') {
            telaLogin.style.display = 'none';
            telaConteudo.style.display = 'block';
            if (navbar) navbar.style.display = 'flex'; // Mostra a navbar se já tiver registro
        }
    }

    if(btnAcessar) {
        btnAcessar.addEventListener('click', function() {
            
            const nomeDigitado = nomeInput.value.trim();
            erroMsg.style.display = 'none';
            erroMsg.innerText = '';

            // Validação 1: Mínimo de 3 letras
            if (nomeDigitado.length < 3) {
                erroMsg.innerText = 'Por favor, digite um nome válido com pelo menos 3 letras.';
                erroMsg.style.display = 'block';
                return; 
            }

            // Validação 2: Sem letras repetidas diretas
            const nomeSemEspacos = nomeDigitado.replace(/\s/g, '');
            if (/^(.)\1+$/.test(nomeSemEspacos)) {
                erroMsg.innerText = 'Por favor, digite um nome real. Não use letras repetidas.';
                erroMsg.style.display = 'block';
                return; 
            }
            
            statusMsg.style.display = 'block';
            btnAcessar.disabled = true;

            const scriptURL = 'https://script.google.com/macros/s/AKfycbwGtizVaoGhrlhyup4AHbVxdA8IwTdT-j-Tdh1HY6RAqxWjcuL0h5yoONgfzd5bhwn_yQ/exec';
            
            const dados = new FormData();
            dados.append('nome', nomeDigitado);

            fetch(scriptURL, { method: 'POST', body: dados })
                .then(response => {
                    // Grava na sessão que o usuário já se registrou
                    sessionStorage.setItem('acessoRegistrado', 'sim');
                    telaLogin.style.display = 'none';
                    telaConteudo.style.display = 'block';
                    if (navbar) navbar.style.display = 'flex'; // Mostra a navbar após o sucesso
                })
                .catch(error => {
                    console.error('Falha ao tentar registrar o acesso no Sheets:', error.message);
                    
                    // Em caso de falha de conexão, permite acessar, mas também salva a sessão
                    sessionStorage.setItem('acessoRegistrado', 'sim');
                    telaLogin.style.display = 'none';
                    telaConteudo.style.display = 'block';
                    if (navbar) navbar.style.display = 'flex'; // Mostra a navbar mesmo com falha
                });
        });
    }
});