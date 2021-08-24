aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_REGISTRY &&
docker build -t partner-finder-ecs -f Dockerfile.prod . &&
docker tag partner-finder-ecs:latest $ECR_REGISTRY/partner-finder-ecs:latest &&
docker push $ECR_REGISTRY/partner-finder-ecs:latest
