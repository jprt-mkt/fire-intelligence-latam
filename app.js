fetch('data.json')
  .then(r => r.json())
  .then(d => {

    // ===== EXECUTIVE =====
    const exec = document.getElementById('executive');
    exec.innerHTML = `
      <h2>Resumo Executivo</h2>
      <p><strong>${d.sumario_executivo?.headline_dia || 'Sem headline disponível'}</strong></p>
      <p>${d.sumario_executivo?.contexto || 'Sem contexto disponível.'}</p>
      <ul>
        ${(d.sumario_executivo?.acoes_recomendadas || ['Nenhuma ação definida'])
          .map(a => `<li>${a}</li>`).join('')}
      </ul>
    `;

    // ===== MEKKO =====
    const mekko = document.getElementById('mekko');
    const scores = d.score_paises || {};
    const entries = Object.entries(scores);

    if (entries.length === 0) {
      mekko.innerHTML = '<h2>Mekko</h2><p>Sem dados de mercado disponíveis.</p>';
    } else {
      let total = 0;
      entries.forEach(([_, v]) => total += v.market_size_usd || 0);

      const bars = entries.map(([c, v]) => {
        const pct = total ? Math.round((v.market_size_usd / total) * 100) : 0;
        return `<div style="margin:6px 0">${c}: ${pct}% (USD ${v.market_size_usd?.toLocaleString()})</div>`;
      }).join('');

      mekko.innerHTML = `
        <h2>Mekko – Market Size por País</h2>
        ${bars}
      `;
    }

    // ===== PROJECTS =====
    const proj = document.getElementById('projects');
    if (!d.grandes_projetos || d.grandes_projetos.length === 0) {
      proj.innerHTML = '<h2>Grandes Projetos</h2><p>Nenhum projeto identificado.</p>';
    } else {
      proj.innerHTML = `
        <h2>Grandes Projetos</h2>
        <ul>
          ${d.grandes_projetos.map(p =>
            `<li>${p.pais} – ${p.titulo}</li>`).join('')}
        </ul>
      `;
    }

    // ===== INSIGHTS =====
    const ins = document.getElementById('insights');
    const insights = []
      .concat(d.regulacao || [], d.lancamentos_tecnologia || []);

    if (insights.length === 0) {
      ins.innerHTML = '<h2>Insights</h2><p>Nenhum insight disponível.</p>';
    } else {
      ins.innerHTML = `
        <h2>Insights</h2>
        <ul>
          ${insights.map(i => `<li>${i.pais}: ${i.titulo}</li>`).join('')}
        </ul>
      `;
    }

  })
  .catch(err => {
    document.body.innerHTML = '<h2>Erro ao carregar data.json</h2>';
    console.error(err);
  });
