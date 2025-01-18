# pacmusic

> Diasumsikan bahwa staging dan production adalah dua server yang berbeda

## Setup

### Install docker

Untuk install docker lihat : https://docs.docker.com/engine/install

### First step

1. Clone repository

```
git clone git@github.com:nuradiyana/pacmusic.git
```

2. Setting `.env` file

Untuk production

```
APP_IMAGE=nooradiana/pacmusic
APP_TAG=latest

APP_PROD_PORT_1=5000
APP_PROD_PORT_2=5001

MINIO_PROD_ENDPOINT=
MINIO_PROD_ACCESS_KEY=
MINIO_PROD_SECRET_KEY=
```

Untuk staging

```
APP_STG_PORT_1=5002
APP_STG_PORT_2=5003

MINIO_STG_ENDPOINT=
MINIO_STG_ACCESS_KEY=
MINIO_STG_SECRET_KEY=
```

### Running docker compose

Untuk production

```bash
docker compose -f docker-compose.yaml up --build --detach pacmusic-prod-1 pacmusic-prod-2 pacmusic-prod-balancer pacmusic-proxy
```

Untuk staging

```bash
docker compose -f docker-compose.yaml up --build --detach pacmusic-stg-1 pacmusic-stg-2 pacmusic-stg-balancer pacmusic-proxy
```

### Create SSL

1. Running certbot

```bash
docker compose run --rm certbot certonly --webroot --webroot-path /var/www/certbot/ -d [domain-name]
```

2. Update proxy.conf

```
server {
    listen 80;

    server_name pacmusic-stg.fromhome.dev pacmusic-prod.fromhome.dev;
    server_tokens off;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    location / {
        return 301 https://$host$request_uri;
    }
}

# Uncomment bellow if staging
# server {
#     listen 443 ssl;
#     listen [::]:443 ssl;

#     http2 on;

#     server_name pacmusic-stg.fromhome.dev;
#     server_tokens off;

#     ssl_certificate /etc/letsencrypt/live/pacmusic-stg.fromhome.dev/fullchain.pem;
#     ssl_certificate_key /etc/letsencrypt/live/pacmusic-stg.fromhome.dev/privkey.pem;

#     location / {
#         proxy_pass http://pacmusic-stg-balancer:80;

#         proxy_set_header Host $host;
#         proxy_set_header X-Real-IP $remote_addr;
#         proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
#         proxy_set_header X-Forwarded-Proto $scheme;
#     }
# }

# Uncomment bellow if production
# server {
#     listen 443 ssl;
#     listen [::]:443 ssl;

#     http2 on;

#     server_name pacmusic-prod.fromhome.dev;
#     server_tokens off;

#     ssl_certificate /etc/letsencrypt/live/pacmusic-prod.fromhome.dev/fullchain.pem;
#     ssl_certificate_key /etc/letsencrypt/live/pacmusic-prod.fromhome.dev/privkey.pem;

#     location / {
#         proxy_pass http://pacmusic-prod-balancer:80;

#         proxy_set_header Host $host;
#         proxy_set_header X-Real-IP $remote_addr;
#         proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
#         proxy_set_header X-Forwarded-Proto $scheme;
#     }
# }
```

3. Recreate container

Untuk production

```bash
docker compose -f docker-compose.yaml up --force-recreate --build --detach pacmusic-prod-1 pacmusic-prod-2 pacmusic-prod-balancer pacmusic-proxy
```

Untuk staging

```bash
docker compose -f docker-compose.yaml up --force-recreate --build --detach pacmusic-stg-1 pacmusic-stg-2 pacmusic-stg-balancer pacmusic-proxy
```