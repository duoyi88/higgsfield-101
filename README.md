# Higgsfield 101

English expandable tutorial for Higgsfield AI video.

- Local + tunnel: https://higgsfield.ron.best
- Source: single-page static site

## Run locally

```bash
python3 -m http.server 8794 --bind 127.0.0.1 --directory .
```

## DNS

```bash
CLOUDFLARE_API_TOKEN=xxxx ./deploy_dns.sh
# or
cloudflared tunnel login
cloudflared tunnel route dns 9da4a7f8-3748-4f6f-872c-fad2728f6d70 higgsfield.ron.best
```
