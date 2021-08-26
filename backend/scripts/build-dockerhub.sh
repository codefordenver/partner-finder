VERSION="1.0"
docker build -t galbwe92/cfd-partner-finder-api:$VERSION -f Dockerfile.prod .
docker push galbwe92/cfd-partner-finder-api:$VERSION