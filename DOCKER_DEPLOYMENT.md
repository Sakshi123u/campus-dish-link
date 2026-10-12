# Docker and AWS EC2 deployment

This repository is configured to build Campus Dish Link as a Node.js server container using Nitro's `node-server` preset.

## Prerequisites

- Docker Engine installed on the machine used to build/run the image.
- Git.
- An EC2 instance with enough memory for Node.js dependency installation and the production build. A small instance may need swap or a larger instance during the build.

## Test locally

From the repository root:

```bash
docker compose build
docker compose up -d
docker compose ps
docker compose logs -f campus-dish-link
```

Open `http://localhost:3000`. To stop the container:

```bash
docker compose down
```

To rebuild after pulling code changes:

```bash
git pull
docker compose up -d --build
```

## Deploy on Ubuntu EC2

1. Connect to your instance over SSH.
2. Install Git and Docker Engine / Docker Compose plugin if they are not already installed.
3. Clone this repository and enter the project directory.
4. Build and start the app:

```bash
git clone https://github.com/Sakshi123u/campus-dish-link.git
cd campus-dish-link
docker compose up -d --build
docker compose ps
docker compose logs --tail=100 campus-dish-link
```

If you want the files from the Docker setup branch before it is merged into `main`, use:

```bash
git clone --branch docker-ec2-deployment https://github.com/Sakshi123u/campus-dish-link.git
cd campus-dish-link
docker compose up -d --build
```

## AWS Security Group

For a short initial test, add an inbound TCP rule for port `3000` restricted to your own public IP address. Do not open SSH (port 22) to the whole internet. For a public-facing deployment, prefer HTTPS through a reverse proxy/load balancer and keep the app port private where practical.

Then browse to:

```text
http://EC2-PUBLIC-IP:3000
```

Replace `EC2-PUBLIC-IP` with the public IPv4 address of your instance.

## Useful commands

```bash
docker compose ps
docker compose logs -f campus-dish-link
docker compose restart campus-dish-link
docker compose down
```

## Important application notes

- The container runs the existing application; it does not add a shared database.
- The current demo order/service state stored in browser `localStorage` remains browser-local and is not shared between users or containers.
- No AWS database, S3 bucket, CloudWatch integration, domain, or TLS certificate is created by these Docker files.
- This repository currently has no committed npm lockfile, so the image build runs `npm install`. For repeatable builds, generate and commit a lockfile after verifying the project locally.
- Verify the production build and container startup before relying on this deployment. The GitHub file update does not itself run a Docker build or test the app.
