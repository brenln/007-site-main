const hamburguer = document.getElementById('hamburguer');
        const navegacao = document.getElementById('navegacao');

        hamburguer.addEventListener('click', () => {
            hamburguer.classList.toggle('ativo');
            navegacao.classList.toggle('ativo');
        });