#!/bin/bash
set -e

PROJECT="graphql-dataloader"

if ! command -v pass &> /dev/null; then
    echo "pass not found. Install: brew install pass"
    exit 1
fi

if [ ! -d "$HOME/.password-store" ]; then
    echo "Initialize pass first: pass init <gpg-key-id>"
    exit 1
fi

read -p "VM IP: " VM_IP

pass generate -n "${PROJECT}/postgres" 32 > /dev/null
pass generate -n "${PROJECT}/redis" 32 > /dev/null
pass generate -n "${PROJECT}/keycloak-admin" 32 > /dev/null
pass generate -n "${PROJECT}/keycloak-client" 32 > /dev/null
pass generate -n "${PROJECT}/grafana" 32 > /dev/null

cat > .env <<EOF
PORT=3000
NODE_ENV=production

DATABASE_URL=postgres://postgres:$(pass ${PROJECT}/postgres)@postgres:5432/ecommerce?schema=public
POSTGRES_USER=postgres
POSTGRES_PASSWORD=$(pass ${PROJECT}/postgres)

REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=$(pass ${PROJECT}/redis)

CLUSTER_WORKERS=2
INSTANCE_ID=api-1

KEYCLOAK_ADMIN_USER=admin
KEYCLOAK_ADMIN_PASSWORD=$(pass ${PROJECT}/keycloak-admin)
KEYCLOAK_CLIENT_SECRET=$(pass ${PROJECT}/keycloak-client)

GRAFANA_ADMIN_USER=admin
GRAFANA_ADMIN_PASSWORD=$(pass ${PROJECT}/grafana)
EOF

echo "Done. Passwords in pass ${PROJECT}/*"