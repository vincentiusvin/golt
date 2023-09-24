cd server
npm run build
cd ../client
npm run build
docker-compose up -d --build
