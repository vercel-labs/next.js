#!/bin/bash
set -x
U='https://www.vodafone.com.au/images/devices/apple/iphone-15-pro-max/iphone-15-pro-max-natural-titanium-feature1-m.jpg'
E=$(node -e "console.log(encodeURIComponent(process.argv[1]))" "$U")
curl -s -o /dev/null -w "%{http_code} %{content_type}\n" "http://localhost:3000/_next/image?url=$E&w=128&q=75"
