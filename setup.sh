#!/usr/bin/env bash
# Creates a local git repository for ./pkg and installs it as a git dependency
# with pnpm 9 (the version used by the reporter). Any git+ URL works, the
# private-repo part of the report is not required - what matters is that pnpm
# resolves the dependency to a git URL, so the virtual-store directory name
# contains a "#<commit>" fragment.
set -euo pipefail
cd "$(dirname "$0")"
rm -rf node_modules .next pnpm-lock.yaml pkg/.git
node -e "const f='package.json',p=require('./'+f);delete p.dependencies['@my/pkg-cxxxyyyyzzzzaaaabbbbccccddddeeex'];require('fs').writeFileSync(f,JSON.stringify(p,null,2)+'\n')"
git -C pkg init -q -b main
git -C pkg add -A
git -C pkg -c user.email=repro@example.com -c user.name=repro commit -qm init
npx -y pnpm@9.6.0 add "git+file://$PWD/pkg#main"
echo
echo "virtual store dir:"
ls node_modules/.pnpm | grep '@my+pkg'
