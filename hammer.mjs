const base='http://localhost:3000'
const routes=['/privacidade','/seguranca','/termos','/suporte','/reset-password']
const variants=[{},{'Next-Router-Segment-Prefetch':'/_tree'},{'Next-Router-Segment-Prefetch':'/__PAGE__'}]
const codes={}
let bad=[]
async function one(){
  const r=routes[Math.floor(Math.random()*routes.length)]
  const v=variants[Math.floor(Math.random()*variants.length)]
  const res=await fetch(base+r+'?_rsc='+Math.random().toString(36).slice(2,8),{headers:{RSC:'1','Next-Router-Prefetch':'1',...v}})
  const k=res.status
  codes[k]=(codes[k]||0)+1
  if(res.status>=400&&bad.length<5) bad.push({r,v,status:res.status,body:(await res.text()).slice(0,300)})
}
const N=Number(process.argv[2]||3000), C=Number(process.argv[3]||60)
let i=0
await Promise.all(Array.from({length:C},async()=>{while(i++<N) await one()}))
console.log(codes, JSON.stringify(bad,null,1))
