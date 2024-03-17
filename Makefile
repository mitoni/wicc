FRONTEND_DIR := frontend
BACKEND_DIR := backend

dev: dev_frontend dev_backend
	@echo "Closing"

dev_frontend:
	cd $(FRONTEND_DIR) && yarn dev

dev_backend:
	echo $(APP_ENV)
	cd $(BACKEND_DIR) && APP_ENV=development go run .
