#!/bin/sh
# Checks the live guestbook/counter security rules. Usage: SB_URL=... SB_KEY=... scripts/verify-supabase.sh
set -u
rpc() { curl -s -o /tmp/treyos-rpc.json -w "%{http_code}" -X POST "$SB_URL/rest/v1/rpc/$1" -H "apikey: $SB_KEY" -H "Authorization: Bearer $SB_KEY" -H "Content-Type: application/json" -d "$2"; }
fail=0
check() { if [ "$2" = "$3" ]; then echo "ok   $1"; else echo "FAIL $1 (got $2, want $3)"; fail=1; fi; }

code=$(curl -s -o /dev/null -w "%{http_code}" "$SB_URL/rest/v1/guestbook?select=*" -H "apikey: $SB_KEY" -H "Authorization: Bearer $SB_KEY")
[ "$code" = "401" ] || [ "$code" = "403" ] || [ "$code" = "404" ] && echo "ok   anon cannot read the table ($code)" || { echo "FAIL anon table read ($code)"; fail=1; }

check "honeypot rejected" "$(rpc sign_guestbook '{"p_name":"treyos-test","p_message":"hi","p_hp":"bot"}')" 400
check "javascript: website rejected" "$(rpc sign_guestbook '{"p_name":"treyos-test","p_message":"hi","p_website":"javascript:alert(1)"}')" 400
check "501-char message rejected" "$(rpc sign_guestbook "{\"p_name\":\"treyos-test\",\"p_message\":\"$(printf 'x%.0s' $(seq 1 501))\"}")" 400
check "script name stored as text" "$(rpc sign_guestbook '{"p_name":"treyos-test<script>","p_message":"<b>hi</b>"}')" 200
grep -q '<script>' /tmp/treyos-rpc.json && echo "ok   stored verbatim (client escapes on render)"
rpc sign_guestbook '{"p_name":"treyos-test","p_message":"2"}' >/dev/null
rpc sign_guestbook '{"p_name":"treyos-test","p_message":"3"}' >/dev/null
check "4th post in an hour rejected" "$(rpc sign_guestbook '{"p_name":"treyos-test","p_message":"4"}')" 400
rpc hit_count '{}' >/dev/null; before=$(cat /tmp/treyos-rpc.json)
rpc hit '{}' >/dev/null; after=$(cat /tmp/treyos-rpc.json)
check "hit increments by one" "$((after - before))" 1
rpc list_guestbook '{"p_limit":1000}' >/dev/null
n=$(python3 -c "import json;print(len(json.load(open('/tmp/treyos-rpc.json'))))")
[ "$n" -le 100 ] && echo "ok   list capped ($n rows)" || { echo "FAIL list not capped ($n)"; fail=1; }
exit $fail
