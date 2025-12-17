import feedparser,json
from datetime import date
TODAY=str(date.today())
def detect_country(t):
 t=t.lower()
 if "brasil" in t or "brazil" in t: return "Brasil"
 if "mexico" in t or "méxico" in t: return "Mexico"
 if "chile" in t: return "Chile"
 if "colombia" in t: return "Colombia"
 if "argentina" in t: return "Argentina"
 if "peru" in t: return "Peru"
 return "Resto LATAM"
SOURCES={
 "regulacao":["https://www.nfpa.org/rss/news"],
 "lancamentos_tecnologia":["https://www.fireengineering.com/feed/"],
 "grandes_projetos":["https://www.bnamericas.com/en/rss/infrastructure"]
}
data={"data_ref":TODAY,"regulacao":[],"lancamentos_tecnologia":[],"grandes_projetos":[]}
for sec,feeds in SOURCES.items():
 for f in feeds:
  feed=feedparser.parse(f)
  for e in feed.entries[:3]:
   txt=e.title+getattr(e,'summary','')
   data[sec].append({"titulo":e.title,"pais":detect_country(txt),"link":e.link})
scores={}
for sec in data:
 if isinstance(data[sec],list):
  for i in data[sec]:
   scores.setdefault(i["pais"],{"risco":0,"oportunidade":0})
   if sec=="regulacao": scores[i["pais"]]["risco"]+=1
   else: scores[i["pais"]]["oportunidade"]+=1
data["score_paises"]=scores
data["sumario_executivo"]={
 "headline_dia":"Resumo automático diário do mercado de incêndio LATAM",
 "contexto":"Resumo gerado automaticamente a partir dos eventos coletados.",
 "acoes_recomendadas":["Priorizar países com maior oportunidade","Rever riscos regulatórios"]
}
with open("data.json","w",encoding="utf-8") as f:
 json.dump(data,f,ensure_ascii=False,indent=2)
