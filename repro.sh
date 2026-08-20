#!/bin/sh
# start `npm run dev` first
curl -s -i --path-as-is 'http://localhost:3000/image/https://i.imgur.com/V7WhMQt.jpeg' | head -3
curl -s -i --path-as-is 'http://localhost:3000/image/https:/i.imgur.com/V7WhMQt.jpeg' | tail -2
