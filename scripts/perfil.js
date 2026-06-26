const params = new URLSearchParams(window.location.search);
const id = params.get('id');

const tierIndex = {
  'Semi-charged': 0,
  'Charged': 1,
  'Overcharged': 2,
  'Megacharged': 3,
};

const weaponMap = {
  'SmartBow':               { img: 'speedshot',              tipo: 'DANO À DISTÂNCIA',   tid: 'ARCO VENENOSO' },
  'Zapper':                 { img: 'zapsicle',                tipo: 'DANO CORPO A CORPO',  tid: 'FULMINADOR' },
  'ToothpickAndShield':     { img: 'toothpick_and_shield',    tipo: 'TANQUE',              tid: 'ESCUDO MAGMÁTICO' },
  'StaffOfGoodAndBadVibes': { img: 'staff_of_good_vibes',     tipo: 'CURADOR',             tid: 'MODULADOR DE ENERGIAS' },
  'Singularity':            { img: 'singularity',             tipo: 'FAZ-TUDO',            tid: 'SINGULARIDADE' },
  'Hammer':                 { img: 'icon_weapon_head_banger',  tipo: 'DANO CORPO A CORPO',  tid: 'BATE-CABEÇA' },
  'Squid':                  { img: 'jaded_blades',             tipo: 'DANO CORPO A CORPO',  tid: 'ADAGAS DE LULA' },
  'PoisonBow':              { img: 'poison_bow',               tipo: 'DANO À DISTÂNCIA',   tid: 'ARCO VENENOSO' },
  'TechnoFists':            { img: 'techno_fists',             tipo: 'FAZ-TUDO',            tid: 'TECNOPUNHOS' },
  'WolfStick':              { img: 'wolf_stick',               tipo: 'INVOCADOR',           tid: 'BASTÃO-LOBO' },
};

const typeColor = {
  'DANO À DISTÂNCIA':   '#db2424',
  'DANO CORPO A CORPO': '#d47217',
  'CURADOR':            '#14D921',
  'FAZ-TUDO':           '#a855f7',
  'TANQUE':             '#4a8ef5',
  'INVOCADOR':          '#135a45',
};

const typeIcon = {
  'DANO À DISTÂNCIA':   'icon_range',
  'DANO CORPO A CORPO': 'icon_melee',
  'CURADOR':            'icon_heal',
  'FAZ-TUDO':           'icon_allrounder',
  'TANQUE':             'icon_tank',
  'INVOCADOR':          'icon_pet',
};

function gemImg(type, tier) {
  const t = tierIndex[tier] ?? 0;
  return `<img src="../image/moco/image/cores/gem_${type.toLowerCase()}_${t}.png" alt="${type}" class="gema-img">`;
}

function renderKit(kitName, kitData) {
  const info = weaponMap[kitName];
  const cor = typeColor[info.tipo] || '#fff';
  const desbloqueada = !!kitData;
  const gemas = desbloqueada ? (kitData.equippedGems || []).map(g => gemImg(g.type, g.tier)).join('') : '';

  return `
    <div class="kit-card ${!desbloqueada ? 'kit-locked' : ''}">
      <div class="kit-tipo" style="border-color: ${desbloqueada ? cor : '#555'}; color: ${desbloqueada ? cor : '#555'};">
        <img src="../image/moco/image/weapons/icons/${typeIcon[info.tipo]}.png" alt="${info.tipo}" class="tipo-icon">
        ${info.tipo}
      </div>
      <img src="../image/moco/image/weapons/${info.img}.png" alt="${info.tid}" class="arma-img ${!desbloqueada ? 'arma-locked' : ''}">
      <span class="kit-nome">${info.tid}</span>
      <div class="kit-gemas">${gemas}</div>
    </div>
  `;
}

async function carregarPerfil() {
  if (!id) {
    document.getElementById('perfil-container').innerHTML = '<p>Membro não encontrado.</p>';
    return;
  }

  try {
    const res = await fetch(`https://api.corp007.com/api/perfil/${id}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const m = await res.json();

    document.title = `${m.name}`;

    const kitsPorNome = {};
    (m.battleKits || []).forEach(kit => {
      const nome = kit.resolved?.name;
      if (nome) kitsPorNome[nome] = kit;
    });

    const armasHtml = Object.keys(weaponMap)
      .map(nome => renderKit(nome, kitsPorNome[nome] || null))
      .join('');

    const badgesHtml = (m.showcaseBadges || []).map(b => {
      if (!b || !b.resolved) return '';
      const r = b.resolved;
      const asset = r.iconAsset || (r.baseIconAsset ? `${r.baseIconAsset}${r.level}` : null);
      if (!asset) return '';
      return `<img src="../image/moco/image/collector_badge/${asset}.png" alt="${r.name}" class="badge-img" onerror="this.style.display='none'">`;
    }).join('');

    document.getElementById('perfil-container').innerHTML = `
      <button class="btn-voltar" onclick="history.back()">↩</button>
      <div class="perfil-banner" style="background-image: url('../image/moco/image/banner/${m.bannerAsset}.png')">
        <div class="perfil-banner-overlay">
          <div class="perfil-topo">
            <div class="perfil-nivel">${m.currentLevel}</div>
            <div class="perfil-info">
              <h1 class="perfil-nome">${m.name}</h1>
              <span class="perfil-titulo" style="color: ${m.titleResolved?.color || '#fff'}">${m.titleResolved?.text || ''}</span>
            </div>
          </div>
          <div class="perfil-badges">${badgesHtml}</div>
        </div>
      </div>

      <div class="perfil-stats">
        <div class="stat-card">
          <span class="stat-label">Nível de Carreira</span>
          <span class="stat-valor">${m.careerLevel}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Méritos de Elite</span>
          <span class="stat-valor">
            <img src="../image/moco/image/other/elite_merit.png" class="stat-icon"> ${m.eliteMerits.toLocaleString('pt-BR')}
          </span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Monstros Caçados</span>
          <span class="stat-valor">
            <img src="../image/moco/image/other/icon_monster_boss.png" class="stat-icon"> ${m.monstersHunted.toLocaleString('pt-BR')}
          </span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Armas Coletadas</span>
          <span class="stat-valor">
            <img src="../image/moco/image/other/icon_gizmo.png" class="stat-icon"> ${m.weaponsCollected}
          </span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Caçador Desde</span>
          <span class="stat-valor">${new Date(m.hunterSince).toLocaleDateString('pt-BR')}</span>
        </div>
      </div>

      <div class="armas-section">
        <h2 class="armas-titulo">Weapons</h2>
        <div class="armas-grid">
          ${armasHtml}
        </div>
      </div>
    `;

  } catch (err) {
    document.getElementById('perfil-container').innerHTML = `<p>Erro ao carregar perfil: ${err.message}</p>`;
    console.error(err);
  }
}

carregarPerfil();