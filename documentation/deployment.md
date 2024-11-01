# Deployment
## Docker Installation
1. Access the [Get Docker](https://docs.docker.com/get-started/get-docker/) page and download the docker application.
2. Follow the installation and run instructions included for your OS (linked from the download page).
3. Run Docker on your machine.

## Local Deployment
1. Navigate to `team-36-monorepo`
2. Run `docker-compose up --build -d`
3. In a browser, access the webpage at [http://localhost:3000](http://localhost:3000)

## Production Deployment
TBD

## FAQ
- **Database Corruption**: If you run into issues with your database (e.g. `admin` user not initialized, corrupted data), you can perform a complete reset using this command: `docker-compose down -v`. This will remove the existing volume so that, when you start the container again, it will force PostgreSQL to reinitialize the user and database based on environment variables in the Docker Compose file.
