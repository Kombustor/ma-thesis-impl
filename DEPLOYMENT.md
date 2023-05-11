# Deployment

## General

#### Create the postgres cluster

```console
$ fly pg create --name platform-postgres
```

#### Wait for the cluster to be ready (command exits)

## Inference

### First deploy

#### Create the app on fly

```console
$ fly apps create inference --machines
```

#### Define environment variables in toml

```toml
[env]
  PORT = "9090" # The port which tired-proxy proxies to
  TIME_TO_SHUTDOWN = "600" # The idle time for tired-proxy in seconds
```

#### Release public IPs to make the service private only

```console
$ fly ips list --app inference
$ fly ips release --app inference <ipv4>
$ fly ips release --app inference <ipv6>
```

#### Add a private IP to make the traffic go through the fly proxy (for waking up)

```console
$ fly ips allocate-v6 --private -a inference
```

### Every deploy

#### Deploy the app with local building

```console
$ fly deploy -c apps/inference/fly.toml --dockerfile inference.Dockerfile --local-only --strategy immediate --build-arg HUGGINGFACE_REPO_SLUG="mediabiasgroup/DA-RoBERTa-BABE"
```

#### Scale up the memory

##### Get the machine id

```console
$ fly machine ls -a inference
```

##### Scale the machine

```console
$ fly machine update -a inference-v1 --cpus 1 --memory 2048 <id>
```

## Platform

### First deploy

#### Create the app on fly

```console
$ fly apps create platform
```

#### Define environment variables in toml

```toml
[env]
  PORT = 8080
  NEXTAUTH_URL = "https://platform.fly.dev"
  INFERENCE_URL = "http://[fdaa:0:aa90:0:1::2]" # private Flycast ipv6 assigned to inference
  DATABASE_PRIMARY_REGION = "ams" # primary region code (3 letters) of the database cluster
```

#### Attach a new database table in the existing database cluster to the newly created app

- DATABASE_URL env variable is set automatically in the app

```console
$ fly postgres attach --app platform platform-postgres
```

#### Set the SECRET environment variable

```console
$ fly secrets set --app platform SECRET=$(openssl rand -base64 32)
```

#### Set the email related secrets

```console
$ fly secrets set --app platform EMAIL_FROM="platform@mbg.3hy.de" EMAIL_SERVER="smtps://apikey:<apikey>@smtp.sendgrid.net"
```

### Every deploy

#### Deploy the app with local building

```console
$ fly deploy -c apps/platform/fly.toml --dockerfile platform.Dockerfile --local-only
```

## Analytics (Umami)

### First deploy

#### Create the app on fly

```console
$ fly apps create newsunfold-analytics
```

#### Attach a new database table in the existing database cluster to the newly created app

```console
$ fly postgres attach --app newsunfold-analytics platform-postgres
```

### Every deploy

#### Deploy

```console
$ fly deploy -c apps/platform/analytics.fly.toml
```

## Misc

### To add yourself initially to the email whitelist

- `flyctl postgres connect -a platform-postgres`
- List databases: `\l`
- Connect to database: `\c platform_vx`
- List tables: `\d+`
- Show table: `\d+ "EmailWhitelist"`
- Insert: `INSERT INTO "EmailWhitelist" VALUES ('<generate a random v4 uuid>', '<name>', '<email>');`
- Quit: `\q`
