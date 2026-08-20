const fs=require('fs'),path=require('path'),esbuild=require('esbuild')
const targets=['safari12','safari13','ios12','ios13']
const files=[];(function w(d){for(const e of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,e.name);e.isDirectory()?w(p):p.endsWith('.js')&&files.push(p)}})('.next/static/chunks')
for(const t of targets){
  let fails=[]
  for(const f of files){
    try{esbuild.transformSync(fs.readFileSync(f,'utf8'),{target:t,loader:'js'})}
    catch(e){fails.push(f+' :: '+(e.errors||[]).map(x=>x.text+' @'+(x.location&&x.location.lineText||'').slice(0,60)).join(' | '))}
  }
  console.log(`target=${t}: ${fails.length}/${files.length} chunks unsupported`)
  fails.slice(0,5).forEach(x=>console.log('   '+x))
}
