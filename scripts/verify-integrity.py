import re,hashlib,base64,urllib.request,sys
base=sys.argv[1]; routes=sys.argv[2:]
tot=0;bad=0
for r in routes:
    try:
        html=urllib.request.urlopen(base+r).read().decode('utf8','replace')
    except Exception as e:
        print("ROUTE ERR",r,e); continue
    for m in re.finditer(r'<(?:script|link)[^>]*?(?:src|href)="([^"]+)"[^>]*?integrity="([^"]+)"[^>]*>|<(?:script|link)[^>]*?integrity="([^"]+)"[^>]*?(?:src|href)="([^"]+)"[^>]*>',html):
        src=m.group(1) or m.group(4); integ=m.group(2) or m.group(3)
        if not src.startswith('/'): continue
        try: data=urllib.request.urlopen(base+src, timeout=30).read()
        except Exception as e: print("MISSING",r,src,e); bad+=1; continue
        got="sha256-"+base64.b64encode(hashlib.sha256(data).digest()).decode()
        tot+=1
        if got!=integ:
            bad+=1; print("MISMATCH", r, src, "attr",integ,"actual",got)
print("checked",tot,"bad",bad)
