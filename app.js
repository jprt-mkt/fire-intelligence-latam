fetch('data.json').then(r=>r.json()).then(data=>{
document.getElementById('date').innerText='Snapshot: '+data.data_ref;

// Summary
const s=data.sumario_executivo;
document.getElementById('executive-summary').innerHTML=`
<h2>Resumo Executivo</h2>
<h3>${s.headline_dia}</h3>
<p>${s.contexto}</p>
<ul>${(s.acoes_recomendadas||[]).map(a=>`<li>${a}</li>`).join('')}</ul>`;

// Mekko
const scores=data.score_paises||{};
let total=0;
Object.values(scores).forEach(v=>{total+= (v.oportunidade||0)+(v.risco||0) || 1});
const colors=['#2563eb','#16a34a','#dc2626','#ca8a04','#7c3aed','#0891b2','#4b5563'];
let i=0;
const mekkoSegs=Object.entries(scores).map(([c,v])=>{
 const value=(v.oportunidade||0)+(v.risco||0)||1;
 const pct=Math.round((value/total)*100);
 return `<div class="mekko-seg" style="width:${pct}%;background:${colors[i++%colors.length]}">${c} ${pct}%</div>`;
}).join('');
document.getElementById('mekko').innerHTML=`<h2>Mekko LATAM</h2><div class="mekkobar mekko-bar">${mekkoSegs}</div>`;

// Opportunities
const opp=Object.entries(scores).map(([c,v])=>`
<div class="country-card"><strong>${c}</strong><br>Oportunidade: ${v.oportunidade||0} | Risco: ${v.risco||0}</div>`).join('');
document.getElementById('opportunities').innerHTML=`<h2>Oportunidades & Riscos</h2>${opp}`;

// Insights
const insights=[...(data.regulacao||[]),...(data.lancamentos_tecnologia||[])]
.map(i=>`<li>${i.pais}: ${i.titulo}</li>`).join('');
document.getElementById('insights').innerHTML=`<h2>Insights</h2><ul>${insights}</ul>`;

// Projects
const proj=(data.grandes_projetos||[]).map(p=>`<li>${p.pais}: ${p.titulo}</li>`).join('');
document.getElementById('projects').innerHTML=`<h2>Grandes Projetos</h2><ul>${proj}</ul>`;
});
