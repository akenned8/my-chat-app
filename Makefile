.PHONY: build deploy clean update-env-production build-prod publish-prod	

# Variables
STACK_NAME = my-chat-app-stack
BUCKET_NAME = my-chat-app-bucket
BUCKET_NAME_PROD = my-chat-app-bucket-prod
REGION = us-east-1
REGION_PROD = us-east-2
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


create-bucket-prod:
	aws s3 mb s3://$(BUCKET_NAME_PROD) \
		--region $(REGION_PROD)

create-bucket-and-policy-prod:
	# Deploy CloudFormation stack
	aws cloudformation create-stack \
		--stack-name $(STACK_NAME) \
		--template-body file://templates/s3.yml \
		--region $(REGION_PROD) \
		--capabilities CAPABILITY_NAMED_IAM

update-env-production:
	url=$$(aws elbv2 describe-load-balancers --query "LoadBalancers[?contains(LoadBalancerName, 'my-chat-server-alb')].DNSName" --output text) && \
	echo "REACT_APP_API_URL=http://$$url" > .env.production; \
	echo "REACT_APP_WS_URL=http://$$url" >> .env.production

build-prod: update-env-production
	npm run build

publish-prod:
	# Sync built files to S3
	aws s3 sync build/ s3://$(BUCKET_NAME_PROD) \
		--region $(REGION_PROD)
