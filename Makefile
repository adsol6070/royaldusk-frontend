# Variables
DOCKER_COMPOSE = docker compose
PROJECT_NAME = royaldusk

# Build and start all services
up:
	$(DOCKER_COMPOSE) up -d --build

# Stop all services
down:
	$(DOCKER_COMPOSE) down

# Restart services (useful after config changes)
restart:
	$(DOCKER_COMPOSE) restart

# View logs of all services
logs:
	$(DOCKER_COMPOSE) logs -f

# Renew SSL certificates manually
renew-cert:
	docker exec certbot certbot renew --quiet && $(DOCKER_COMPOSE) restart nginx

# Remove unused containers, networks, and images
clean:
	$(DOCKER_COMPOSE) down --volumes --remove-orphans
	docker system prune -af

# Check running containers
ps:
	$(DOCKER_COMPOSE) ps

# Execute shell inside the Nginx container
nginx-shell:
	docker exec -it nginx_proxy /bin/sh

# Execute shell inside the Certbot container
certbot-shell:
	docker exec -it certbot /bin/sh

# Build images without running containers
build:
	$(DOCKER_COMPOSE) build

# Pull latest images
pull:
	$(DOCKER_COMPOSE) pull

# Rebuild and restart containers
rebuild:
	$(DOCKER_COMPOSE) up -d --build --force-recreate

.PHONY: up down restart logs renew-cert clean ps nginx-shell certbot-shell build pull rebuild
