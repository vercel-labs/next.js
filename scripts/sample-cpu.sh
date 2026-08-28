#!/bin/bash
# samples system-wide CPU utilisation (cores busy) every 2s
prev=$(awk '/^cpu /{t=0;for(i=2;i<=NF;i++)t+=$i;print t" "$5}' /proc/stat)
while true; do
  sleep 2
  cur=$(awk '/^cpu /{t=0;for(i=2;i<=NF;i++)t+=$i;print t" "$5}' /proc/stat)
  read pt pi <<< "$prev"; read ct ci <<< "$cur"
  dt=$((ct-pt)); di=$((ci-pi))
  echo "$(date +%s) cores_busy=$(awk -v a=$dt -v b=$di 'BEGIN{printf "%.2f", (a-b)/(a/'"$(nproc)"')}')"
  prev="$cur"
done
