#!/usr/bin/env bash
# higgsfield.ron.best DNS CNAME (proxied) -> cloudflared tunnel
# Usage:
#   CLOUDFLARE_API_TOKEN=xxxx ./deploy_dns.sh
# Or after: cloudflared tunnel login
#   cloudflared tunnel route dns 9da4a7f8-3748-4f6f-872c-fad2728f6d70 higgsfield.ron.best
set -euo pipefail

TUNNEL="9da4a7f8-3748-4f6f-872c-fad2728f6d70.cfargotunnel.com"
ZONE_NAME="ron.best"
NAME="higgsfield"

if [ -z "${CLOUDFLARE_API_TOKEN:-}" ]; then
  echo "Need CLOUDFLARE_API_TOKEN (DNS:Edit on ron.best)"
  echo "Alt: cloudflared tunnel login && cloudflared tunnel route dns 9da4a7f8-3748-4f6f-872c-fad2728f6d70 higgsfield.ron.best"
  exit 1
fi

echo "→ zone id..."
ZONE_ID=$(curl -s "https://api.cloudflare.com/client/v4/zones?name=${ZONE_NAME}" \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
  | python3 -c "import sys,json;d=json.load(sys.stdin);print(d['result'][0]['id'] if d.get('success') and d['result'] else '')")
[ -z "$ZONE_ID" ] && { echo "✗ zone id failed"; exit 1; }
echo "  $ZONE_ID"

echo "→ create CNAME ${NAME} -> ${TUNNEL} (proxied)"
curl -s -X POST "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/dns_records" \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" -H "Content-Type: application/json" \
  --data "{\"type\":\"CNAME\",\"name\":\"${NAME}\",\"content\":\"${TUNNEL}\",\"proxied\":true,\"comment\":\"Higgsfield 101 tutorial\"}" \
  | python3 -c "import sys,json;d=json.load(sys.stdin);print('✓',d['result']['name'],'->',d['result']['content']) if d.get('success') else print(json.dumps(d.get('errors',d),ensure_ascii=False))"

for i in $(seq 1 12); do
  sleep 5
  code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 15 https://higgsfield.ron.best/ || echo 000)
  echo "  try $i: HTTP $code"
  [ "$code" = "200" ] && { echo "✅ https://higgsfield.ron.best live"; exit 0; }
done
echo "⚠ DNS may still be propagating"
