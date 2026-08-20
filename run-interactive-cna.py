import pty, os, sys, time, select, re
strip=re.compile(rb"\x1b\[[0-9;?]*[a-zA-Z]|\x1b\][^\x07]*\x07|\x1b[78]")
pid,fd=pty.fork()
if pid==0:
    os.chdir("/workspace/cna-test"); os.environ["TERM"]="xterm"
    os.execvp("npx",["npx","--yes","create-next-app@latest","aliasapp8"])
buf=b""; log=open("/workspace/cna-test/alias10.log","wb")
def pump(t):
    global buf
    end=time.time()+t
    while time.time()<end:
        r,_,_=select.select([fd],[],[],0.15)
        if r:
            try: d=os.read(fd,8192)
            except OSError: return False
            if not d: return False
            buf+=d; log.write(d); log.flush()
    return True
def txt(): return strip.sub(b"",buf).decode("utf8","replace")
def wait(s,timeout=90):
    end=time.time()+timeout
    while time.time()<end:
        if s.lower() in txt().lower(): return True
        if not pump(0.3): return False
    return False
def answered(s):  # prompt resolved marker
    return ("✔ "+s.split("|")[0]) in txt()
steps=[("recommended Next.js defaults", [b"\x1b[B", b"\r"]),
       ("Would you like to use TypeScript?", [b"\r"]),
       ("Which linter", [b"\r"]),
       ("Would you like to use React Compiler?", [b"\r"]),
       ("Would you like to use Tailwind CSS?", [b"\r"]),
       ("`src/` directory", [b"\r"]),
       ("App Router", [b"\r"]),
       ("customize the import alias", [b" ", b"\r"]),
       ]
for text,keys in steps:
    ok=wait(text)
    print(f"[{'OK ' if ok else 'MISS'}] {text}"); sys.stdout.flush()
    if not ok: continue
    time.sleep(0.8)
    for k in keys:
        os.write(fd,k); pump(0.6)
    print("   screen:", repr(txt()[-160:])); sys.stdout.flush()
if wait("import alias would you like", 30):
    print("[OK ] alias text prompt reached"); sys.stdout.flush()
    time.sleep(0.8)
    os.write(fd,b"@/app/*"); pump(1.0)
    print("   typed screen:", repr(txt()[-200:])); sys.stdout.flush()
    os.write(fd,b"\r"); pump(3)
    if wait("AGENTS.md",30):
        time.sleep(0.8); os.write(fd,b"\r"); pump(2)
    print("   after enter:", repr(txt()[-500:])); sys.stdout.flush()
else:
    print("[MISS] alias text prompt")
pump(120)
print("=== TAIL ===")
print(txt()[-2500:])
