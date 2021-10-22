VERSION="1.0.1"
docker build -t galbwe92/cfd-partner-finder-frontend:$VERSION -f Dockerfile.prod .
docker push galbwe92/cfd-partner-finder-frontend:$VERSION