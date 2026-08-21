#!/usr/bin/env bash
# Reproduction for vercel/next.js#89773
# Do NOT run `npm install`: the bug only shows when `next` is not installed yet
# and package.json carries a semver range ("next": "^16").
set -x
# 1. Version at the time of the report: range "^16" is parsed as literal "16"
npx --yes @next/codemod@16.2.0-canary.33 agents-md --output AGENTS.md
# 2. Current canary: range is ignored entirely, detection just fails
npx --yes @next/codemod@canary agents-md --output AGENTS.md
