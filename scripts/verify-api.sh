#!/bin/sh
# Live checks for the guestbook/counter API. Usage: scripts/verify-api.sh [base-url]
BASE="${1:-https://api.treyyadon.space}"
O="Origin: https://treyyadon.space"
fail=0
post() { curl -s -o /tmp/treyos-api.json -w "%{http_code}" -X POST "$BASE/api/guestbook" -H "$O" -H "Content-Type: application/json" -d "$1"; }
check() { if [ "$2" = "$3" ]; then echo "ok   $1"; else echo "FAIL $1 (got $2, want $3)"; fail=1; fi; }

check "honeypot rejected" "$(post '{"name":"treyos-test","message":"hi","hp":"bot"}')" 400
check "javascript: website rejected" "$(post '{"name":"treyos-test","message":"hi","website":"javascript:alert(1)"}')" 400
check "501-char message rejected" "$(post "{\"name\":\"treyos-test\",\"message\":\"$(printf 'x%.0s' $(seq 1 501))\"}")" 400
check "201-char website rejected" "$(post "{\"name\":\"treyos-test\",\"message\":\"hi\",\"website\":\"https://$(printf 'a%.0s' $(seq 1 200))\"}")" 400
check "foreign site POST blocked" "$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE/api/hits" -H "Origin: https://evil.example")" 403
check "empty name rejected" "$(post '{"name":"   ","message":"hi"}')" 400
check "script name accepted as text" "$(post '{"name":"treyos-test<script>","message":"<b>hi</b>"}')" 201
post '{"name":"treyos-test","message":"2"}' >/dev/null
post '{"name":"treyos-test","message":"3"}' >/dev/null
check "4th post in an hour rejected" "$(post '{"name":"treyos-test","message":"4"}')" 400
grep -q "slow down" /tmp/treyos-api.json && echo "ok   rate limit message shown"

before=$(curl -s "$BASE/api/hits" | python3 -c "import json,sys;print(json.load(sys.stdin)['count'])")
after=$(curl -s -X POST "$BASE/api/hits" -H "$O" | python3 -c "import json,sys;print(json.load(sys.stdin)['count'])")
check "hit increments by one" "$((after - before))" 1

# Burst: 10 parallel posts from one IP after the limit resets must not exceed 3.
burst=$(seq 1 10 | xargs -P10 -I{} curl -s -o /dev/null -w "%{http_code}\n" -X POST "$BASE/api/guestbook" -H "$O" -H "Content-Type: application/json" -d '{"name":"treyos-burst","message":"b{}"}' | grep -c 201)
echo "info burst accepted: $burst (must be <= 3 including earlier posts this hour)"
[ "$burst" -le 3 ] || { echo "FAIL rate limit raced"; fail=1; }

acao=$(curl -s -D - -o /dev/null "$BASE/api/hits" -H "Origin: https://evil.example" | grep -i "access-control-allow-origin" | wc -l | tr -d ' ')
check "other sites get no CORS header" "$acao" 0
n=$(curl -s "$BASE/api/guestbook" | python3 -c "import json,sys;print(len(json.load(sys.stdin)['entries']))")
[ "$n" -le 50 ] && echo "ok   list capped ($n rows)" || { echo "FAIL list not capped ($n)"; fail=1; }
exit $fail
