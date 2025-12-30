fetch('data.json')
  .then(r => r.json())
  .then(d => {
    const el = document.getElementById('content');

    if (!d || Object.keys(d).length === 0) {
      el.innerHTML = "<h2>data.json vazio ou inválido</h2>";
      return;
    }

    const headline =
      d.sumario_executivo?.headline_dia ||
      "Sem headline disponível";

    const contexto =
      d.sumario_executivo?.contexto ||
      "Dados carregados, mas sem contexto executivo.";

    el.innerHTML = `
      <h2>${headline}</h2>
      <p>${contexto}</p>
      <pre style="font-size:12px;opacity:.7">
${JSON.stringify(d, null, 2)}
      </pre>
    `;
  })
  .catch(err => {
    document.getElementById('content').innerHTML =
      "<h2>Erro ao carregar data.json</h2>";
    console.error(err);
  });
