FRONTEND_DIR := frontend
BACKEND_DIR := backend

dev: dev_frontend dev_backend
	@echo "Closing"

dev_frontend:
	cd $(FRONTEND_DIR) && NODE_ENV=development yarn dev

dev_backend:
	cd $(BACKEND_DIR) && APP_ENV=development go run .

copy_env:
	scp -i ~/.ssh/wicc-kp.pem backend/.env ec2-user@ec2-44-222-225-182.compute-1.amazonaws.com:/home/ec2-user/wicc/backend

connect_remote:
	ssh -i ~/.ssh/wicc-kp.pem ec2-user@ec2-44-222-225-182.compute-1.amazonaws.com
