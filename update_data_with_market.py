import feedparser, json, re
from datetime import date
TODAY=str(date.today())
with open('market_baseline.json','r',encoding='utf-8') as f:
    MARKET=json.load(f)
SOURCES={'regulacao':['https://www.nfpa.org/rss/news'],'lancamentos_tecnologia':['https://www.fireengineering.com/feed/'],'grandes_projetos':['https://www.bnamericas.com/en/rss/infrastructure']}
def detect_country(t):
 t=t.lower()
 if 'brasil' in t or 'brazil' in t: return 'Brasil'
 if 'mexico' in t or 'méxico' in t: return 'Mexico'
 if 'chile' in t: return 'Chile'
 if 'colombia' in t: return 'Colombia'
 if 'argentina' in t: return 'Argentina'
 if 'peru' in t: return 'Peru'
 return 'Resto da América Latina'
def parse_project(e):
 txt=(e.title+getattr(e,'summary','')).lower()
 return {'titulo':e.title,'pais':detect_country(txt),'setor':'Industrial','link':e.link}
data={'data_ref':TODAY,'regulacao':[],'lancamentos_tecnologia':[],'grandes_projetos':[]}
for sec,feeds in SOURCES.items():
 for url in feeds:
  feed=feedparser.parse(url)
  for e in feed.entries[:5]:
   if sec=='grandes_projetos': data[sec].append(parse_project(e))
   else: data[sec].append({'titulo':e.title,'pais':detect_country(e.title),'link':e.link})
scores={}
for sec in data:
 if sec=='data_ref': continue
 for i in data.get(sec,[]):
  c=i.get('pais')
  scores.setdefault(c,{'risco':0,'oportunidade':0,'projects':0})
  if sec=='regulacao': scores[c]['risco']+=1
  else: scores[c]['oportunidade']+=1
  if sec=='grandes_projetos': scores[c]['projects']+=1
for c,b in MARKET.items():
 scores.setdefault(c,{'risco':0,'oportunidade':0,'projects':0})
 scores[c]['market_size_usd']=b['market_size_usd']
 scores[c]['estimated_kidde_revenue_usd']=int(b['market_size_usd']*b['players'].get('Kidde',0))
data['score_paises']=scores
data['sumario_executivo']={'headline_dia':'Resumo automático com base em dados públicos','contexto':'Baseline público','acoes_recomendadas':['Priorizar países com maior pipeline','Defender share onde Kidde é líder']}
with open('data.json','w',encoding='utf-8') as f:
 json.dump(data,f,ensure_ascii=False,indent=2)
