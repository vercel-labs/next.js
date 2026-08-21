#!/usr/bin/env python3
"""Reproduction for vercel/next.js#83429 -- `git clone` of next.js fails on
Windows with "error: unable to create file <path>: Filename too long".

Cause: the repo tracks paths up to ~200-210 characters long (turbopack snapshot
outputs + next-custom-transforms fixtures). Git for Windows with the default
core.longpaths=false refuses any *fully resolved* path longer than MAX_PATH
(260), so files fail once the clone root is ~60+ characters.

Part 1 (portable): counts tracked paths that blow the 260-char budget for a
given clone root.
Part 2 (Linux): actually runs `git clone` with an LD_PRELOAD shim that makes
file/dir creation fail with ENAMETOOLONG above 260 resolved characters, i.e. the
same limit Git for Windows enforces. Git then prints the reporter's exact errors.

  python3 repro.py                    # ROOT_LEN=69 (matches the report)
  ROOT_LEN=40 python3 repro.py        # short clone root => passes
  REF=<sha> python3 repro.py          # analyse another commit
"""
import json, os, re, shutil, subprocess, sys, urllib.request

REPO = os.environ.get("REPO", "https://github.com/vercel/next.js.git")
REF = os.environ.get("REF", "canary")
ROOT_LEN = int(os.environ.get("ROOT_LEN", "69"))
LIMIT = int(os.environ.get("MAXPATH_LIMIT", "260"))
HERE = os.path.dirname(os.path.abspath(__file__))


def tracked_paths():
    url = f"https://api.github.com/repos/vercel/next.js/git/trees/{REF}?recursive=1"
    req = urllib.request.Request(url, headers={"User-Agent": "repro-83429"})
    with urllib.request.urlopen(req) as r:
        data = json.load(r)
    assert not data.get("truncated")
    return [t["path"] for t in data["tree"] if t["type"] == "blob"]


def part1(paths):
    budget = LIMIT - ROOT_LEN - 1
    over = sorted((p for p in paths if len(p) > budget), key=len, reverse=True)
    print(f"== Part 1: static check, ref={REF}, clone-root length {ROOT_LEN}, "
          f"MAX_PATH {LIMIT} ==")
    print(f"tracked blobs {len(paths)}, longest repo-relative path "
          f"{max(len(p) for p in paths)} chars, per-file budget {budget} chars")
    print(f"paths that cannot be created: {len(over)}")
    for p in over[:8]:
        print(f"  {ROOT_LEN + 1 + len(p):4d}  {p}")
    return over


def make_root():
    base = os.path.join(HERE, "clone-root")
    shutil.rmtree(base, ignore_errors=True)
    os.makedirs(base)
    cur = base
    if len(cur) > ROOT_LEN:
        sys.exit(f"run from a shorter directory: {len(cur)} > ROOT_LEN={ROOT_LEN}")
    while len(cur) < ROOT_LEN:
        need = ROOT_LEN - len(cur) - 1
        seg = "w" * min(need, 200) if need > 0 else ""
        if not seg:
            break
        cur = os.path.join(cur, seg)
        os.makedirs(cur)
    return cur


def part2():
    so = os.path.join(HERE, "maxpath260.so")
    src = os.path.join(HERE, "maxpath260.c")
    if not os.path.exists(so):
        subprocess.run(["gcc", "-shared", "-fPIC", "-O1", "-o", so, src, "-ldl"],
                       check=True)
    root = make_root()
    env = dict(os.environ, LD_PRELOAD=so, MAXPATH_LIMIT=str(LIMIT))
    print(f"\n== Part 2: real `git clone` into a {len(root)}-char root with the "
          f"MAX_PATH={LIMIT} shim ==")
    p = subprocess.run(["git", "clone", "--depth", "1", "--branch", REF, REPO, "."],
                       cwd=root, env=env, capture_output=True, text=True)
    out = p.stdout + p.stderr
    bad = [l.strip() for l in out.splitlines() if re.search(r"file ?name too long", l, re.I)]
    print(f"git clone exit code: {p.returncode}")
    print(f'errors containing "Filename too long": {len(bad)}')
    for l in bad[:10]:
        print("  " + l[:400])
    tail = [l for l in out.splitlines() if l.startswith(("fatal", "warning"))]
    for l in tail[-5:]:
        print("  " + l[:300])
    return p.returncode, bad


if __name__ == "__main__":
    over = part1(tracked_paths())
    if sys.platform == "win32":
        print("On Windows just run `git clone` directly; Part 2 emulation is for Linux.")
        sys.exit(1 if over else 0)
    code, bad = part2()
    print("\nRESULT: reproduced" if bad else "\nRESULT: not reproduced")
    sys.exit(0 if bad else 1)
