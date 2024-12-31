.PHONY: build deploy clean

# Variables
STACK_NAME = my-chat-app-stack
BUCKET_NAME = my-chat-app-bucket
REGION = us-east-1
LOCALSTACK_ENDPOINT = http://localhost:4566

build:
	npm run build

create-bucket:
	awslocal --endpoint-url=$(LOCALSTACK_ENDPOINT) \
		s3 mb s3://$(BUCKET_NAME) \
		--region $(REGION)

deploy-local: build create-bucket
	# Deploy CloudFormation stack
	awslocal --endpoint-url=$(LOCALSTACK_ENDPOINT) \
		cloudformation create-stack \
		--stack-name $(STACK_NAME) \
		--template-body file://templates/s3.yml \
		--region $(REGION)
	
	# Sync built files to S3
	awslocal --endpoint-url=$(LOCALSTACK_ENDPOINT) \
		s3 sync build/ s3://$(BUCKET_NAME) \
		--region $(REGION)

clean:
	# Remove S3 bucket contents
	awslocal --endpoint-url=$(LOCALSTACK_ENDPOINT) \
		s3 rm s3://$(BUCKET_NAME) --recursive \
		--region $(REGION)
	
	# Delete CloudFormation stack
	awslocal --endpoint-url=$(LOCALSTACK_ENDPOINT) \
		cloudformation delete-stack \
		--stack-name $(STACK_NAME) \
		--region $(REGION)
