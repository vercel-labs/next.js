const port=process.argv[2]
const routes=['/privacidade','/seguranca','/termos','/suporte','/reset-password']
const variants=[{},{'Next-Router-Segment-Prefetch':'/_tree'}]
const reqs=[]
for(let k=0;k<40;k++) for(const r of routes) for(const v of variants) reqs.push(fetch(`http://localhost:${port}${r}?_rsc=`+Math.random().toString(36).slice(2,7),{headers:{RSC:'1','Next-Router-Prefetch':'1',...v}}).then(async res=>({r,s:res.status,b:res.status>=400?(await res.text()).slice(0,200):''})).catch(e=>({r,s:'ERR',b:String(e)})))
const out=await Promise.all(reqs)
const codes={};for(const o of out)codes[o.s]=(codes[o.s]||0)+1
console.log(port,codes, out.filter(o=>o.s!==200&&o.s!==204).slice(0,3))
