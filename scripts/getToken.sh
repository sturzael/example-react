#!/bin/sh

# V2_USER=$1
# V2_PASSW=$2

AUTH_RES=$(curl --request POST \
	--url https://master.freepayroll.co.nz:20001/api/login_check \
	--header 'content-type: application/json' \
	--data '{
        "username": "",
        "password": ""
}')
echo $AUTH_RES
TOKEN="$(jq '.token' <<<$AUTH_RES)"
REF_TOKEN="$(jq '.refresh_token' <<<$AUTH_RES)"

# CY_REPLACE="\"REACT_APP_TOKEN\": $TOKEN,"
ENV_REPLACE="REACT_APP_ACCESSTOKEN: $TOKEN,"
ENV_REF_REPLACE="REACT_APP_REFRESH_TOKEN: $REF_TOKEN,"

sed -i '' "s/REACT_APP_ACCESSTOKEN: .*/$ENV_REPLACE/" ./config/config.dev.ts
sed -i '' "s/REACT_APP_REFRESH_TOKEN: .*/$ENV_REF_REPLACE/" ./config/config.dev.ts
