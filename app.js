fetch("data.json")
.then(r=>r.json())
.then(data=>{
document.getElementById("date").innerText="Snapshot: "+data.data_ref;
const s=data.sumario_executivo;
document.getElementById("summary").innerHTML=`<h2>${s.headline_dia}</h2><p>${s.contexto}</p><ul>${(s.acoes_recomendadas||[]).map(a=>`<li>${a}</li>`).join("")}</ul>`;
const scores=Object.entries(data.score_paises||{}).map(([k,v])=>`<li>${k}: risco ${v.risco} | oportunidade ${v.oportunidade}</li>`).join("");
document.getElementById("scores").innerHTML="<h2>Scores por país</h2><ul>"+scores+"</ul>";
const items=[...(data.regulacao||[]),...(data.grandes_projetos||[]),...(data.lancamentos_tecnologia||[])]
.map(i=>`<li>${i.pais} – ${i.titulo}</li>`).join("");
document.getElementById("content").innerHTML="<h2>Movimentos recentes</h2><ul>"+items+"</ul>";
});
