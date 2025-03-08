# Variables
DOCKER_COMPOSE = docker-compose
PROJECT_NAME = royaldusk
CERTBOT_PATH = ./certbot/conf/live/royaldusk.com/fullchain.pem

# Build and start all services
up:
	@if sudo test -f $(CERTBOT_PATH); then \
		echo "SSL certificate found, starting all services..."; \
		$(DOCKER_COMPOSE) up -d --build nginx dashboard website; \
	else \
		echo "SSL certificate not found, starting Certbot service..."; \
		$(DOCKER_COMPOSE) --profile certbot_setup up -d certbot; \
		sleep 10; \
		echo "Restarting Nginx after Certbot Setup..."; \
		$(DOCKER_COMPOSE) up -d --build nginx dashboard website; \
	fi

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
