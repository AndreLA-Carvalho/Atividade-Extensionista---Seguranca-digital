document.addEventListener('DOMContentLoaded', () => {
    const btnTema = document.getElementById('toggleTheme');
    const themeIcon = document.getElementById('themeIcon');
    const html = document.documentElement;

    const moonIcon = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>';
    const sunIcon = '<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>';

    const setTema = (tema) => {
        if (btnTema) btnTema.setAttribute('aria-pressed', String(tema === 'dark'));

        if (tema === 'dark') {
            html.classList.add('dark-mode');
            if (themeIcon) themeIcon.innerHTML = sunIcon;
        } else {
            html.classList.remove('dark-mode');
            if (themeIcon) themeIcon.innerHTML = moonIcon;
        }
    };

    try {
        setTema(localStorage.getItem('tema'));
    } catch (error) {
        setTema('light');
    }

    if (btnTema) {
        btnTema.addEventListener('click', () => {
            const isDark = html.classList.toggle('dark-mode');
            const novoTema = isDark ? 'dark' : 'light';

            try {
                localStorage.setItem('tema', novoTema);
            } catch (error) {
                // A escolha vale até a página ser recarregada.
            }

            setTema(novoTema);
        });
    }

    const btnAcessar = document.getElementById('btnAcessar');
    const nomeInput = document.getElementById('nomeUsuario');
    const statusMsg = document.getElementById('msg-status');
    const telaLogin = document.getElementById('tela-login');
    const telaConteudo = document.getElementById('tela-conteudo');
    const erroMsg = document.getElementById('erro-nome');
    const navbar = document.getElementById('main-navbar');

    // Uma sessão já registrada pode ir direto ao conteúdo da página inicial, evitando pedir o nome novamente.
    let acessoRegistrado = false;
    try {
        acessoRegistrado = sessionStorage.getItem('acessoRegistrado') === 'sim';
    } catch (error) {
        acessoRegistrado = false;
    }

    if (telaLogin && telaConteudo && acessoRegistrado) {
        telaLogin.hidden = true;
        telaConteudo.hidden = false;
        if (navbar) navbar.hidden = false;
    }

    if (btnAcessar && nomeInput && erroMsg && statusMsg && telaLogin && telaConteudo) {
        telaLogin.addEventListener('submit', (evento) => {
            evento.preventDefault();
            const nomeDigitado = nomeInput.value.trim();

            erroMsg.hidden = true;
            erroMsg.textContent = '';
            nomeInput.removeAttribute('aria-invalid');

            if (nomeDigitado.length < 3) {
                erroMsg.textContent = 'Por favor, digite um nome válido com pelo menos 3 letras.';
                erroMsg.hidden = false;
                nomeInput.setAttribute('aria-invalid', 'true');
                return;
            }

            // Impede a inserção de números no nome
            if (/\d/.test(nomeDigitado)) {
                erroMsg.textContent = 'Por favor, digite um nome válido contendo apenas letras.';
                erroMsg.hidden = false;
                nomeInput.setAttribute('aria-invalid', 'true');
                return;
            }

            // Evita aceitar nomes formados por uma única letra repetida.
            const nomeSemEspacos = nomeDigitado.replace(/\s/g, '');
            if (/^(.)\1+$/.test(nomeSemEspacos)) {
                erroMsg.textContent = 'Por favor, digite um nome real. Não use letras repetidas.';
                erroMsg.hidden = false;
                nomeInput.setAttribute('aria-invalid', 'true');
                return;
            }

            statusMsg.hidden = false;
            btnAcessar.disabled = true;

            // O formulário envia o nome para a planilha usada no registro da atividade.
            const scriptURL = 'https://script.google.com/macros/s/AKfycbwGtizVaoGhrlhyup4AHbVxdA8IwTdT-j-Tdh1HY6RAqxWjcuL0h5yoONgfzd5bhwn_yQ/exec';
            const dados = new FormData();
            dados.append('nome', nomeDigitado);

            fetch(scriptURL, { method: 'POST', body: dados })
                .then(() => liberarAcesso())
                .catch((error) => {
                    // A indisponibilidade da planilha não deve bloquear o material.
                    console.warn('Não foi possível confirmar o registro do acesso.', error);
                    liberarAcesso();
                });
        });
    }

    function liberarAcesso() {
        try {
            sessionStorage.setItem('acessoRegistrado', 'sim');
        } catch (error) {
            // O conteúdo fica disponível mesmo sem salvar a sessão.
        }

        telaLogin.hidden = true;
        telaConteudo.hidden = false;
        if (navbar) navbar.hidden = false;
    }
});

document.addEventListener('click', (evento) => {
    const botao = evento.target instanceof Element
        ? evento.target.closest('.btn-fechar-caixa')
        : null;

    if (!botao) return;

    const detalhes = botao.closest('details');
    if (detalhes) {
        detalhes.removeAttribute('open');
        detalhes.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
});
