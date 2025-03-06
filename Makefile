setup:
	docker-compose up -d --force-recreate nginx

restart:
	docker-compose restart nginx
