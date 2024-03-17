FRONTEND_DIR := frontend
BACKEND_DIR := backend

dev: dev_frontend dev_backend
	@echo "Closing"

dev_frontend:
	cd $(FRONTEND_DIR) && yarn dev

dev_backend:
	echo $(APP_ENV)
	cd $(BACKEND_DIR) && APP_ENV=development go run .

copy_remote:
	scp -i ~/.ssh/wicc-kp.pem -r . ec2-user@ec2-3-85-234-57.compute-1.amazonaws.com:/home/ec2-user/app
