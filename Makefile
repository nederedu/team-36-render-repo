.PHONY: start stop logs status rebuild clean

start:
	@echo "Starting the containers..."
	docker-compose up -d

stop:
	@echo "Stopping the containers..."
	docker-compose down

logs:
	@echo "Showing logs..."
	docker-compose logs -f

status:
	@echo "Checking container status..."
	docker-compose ps

rebuild:
	@echo "Rebuilding and restarting the containers..."
	docker-compose down && docker-compose up --build -d

db-only:
	@echo "Rebuildilng and restarting only the database container..."
	docker-compose down && docker-compose up --build -d db

# Dangerous clean command that requires confirmation
clean:
	@echo "WARNING: This will remove all Docker volumes and delete data."
	@read -p "Are you sure you want to proceed? (yes/no): " confirm && \
	if [ "$$confirm" = "yes" ]; then \
		echo "Removing Docker volumes..."; \
		docker-compose down -v; \
	else \
		echo "Aborted."; \
	fi

test:
	@echo "Running all tests..."
	docker-compose run --rm app npm test

unittest:
	@echo "Running unit tests..."
	docker-compose run --rm app npm run test:unit

inttest:
	@echo "Running integration tests..."
	docker-compose run --rm app npm run test:integration

migrate:
	@echo "Running prisma migrate..."
	docker-compose run --rm app npm run prisma:migrate

generate:
	@echo "Running prisma generate..."
	docker-compose run --rm app npm run prisma:generate

studio:
	@echo "Running prisma studio..."
	docker-compose run --rm app npm run prisma:studio