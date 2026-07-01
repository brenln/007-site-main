const iconesPodio = {
  1: '/image/moco/image/other/icon_first_place.png',
  2: '/image/moco/image/other/icon_seccond_place.png',
  3: '/image/moco/image/other/icon_third_place.png',
};

let dadosGlobais = [];
let filtroAtual = 'merits';

const filtros = {
  merits: (a, b) => b.eliteMerits - a.eliteMerits,
  lvl:    (a, b) => b.currentLevel - a.currentLevel,
};

async function carregarMembro(id) {
  const res = await fetch(`https://api.corp007.com/api/perfil/${id}`);
  return res.json();
}

function renderLinha(m, i) {
  const pos = i + 1;
  const rankDisplay = iconesPodio[pos]
    ? `<img src="${iconesPodio[pos]}" alt="${pos}" class="icone-podio">`
    : `<span class="rank-num">${pos}</span>`;

  return `
    <a class="linha-rank" href="/abb/perfil.html?id=${m.accountId}">
      <img class="avatar" src="/image/moco/image/banner/${m.bannerAsset}.png" alt="${m.name}">
      <div class="rank-num-wrap">${rankDisplay}</div>
      <div class="hunter-info">
        <div class="hunter-dados">
          <span class="hunter-name">${m.name}</span>
          <span class="hunter-sub">Lv. ${m.currentLevel} · ${m.monstersHunted.toLocaleString('pt-BR')} monstros</span>
        </div>
      </div>
      <div class="merits-info">
        ${m.eliteMerits.toLocaleString('pt-BR')}
        <img src="/image/moco/image/other/elite_merit.png" alt="merit" class="icone-merit">
      </div>
    </a>
  `;
}

function aplicarFiltro(filtro) {
  filtroAtual = filtro;
  document.querySelectorAll('.btn-filtro').forEach(b => b.classList.remove('ativo'));
  document.querySelector(`[data-filtro="${filtro}"]`).classList.add('ativo');

  const ordenado = [...dadosGlobais].sort(filtros[filtro]);
  document.getElementById('corpo').innerHTML = ordenado.map(renderLinha).join('');
}

async function renderRanking() {
  const resMembros = await fetch('https://api.corp007.com/api/membros');
  const membros = await resMembros.json();

  dadosGlobais = await Promise.all(membros.map(carregarMembro));

  aplicarFiltro(filtroAtual);
}

renderRanking();