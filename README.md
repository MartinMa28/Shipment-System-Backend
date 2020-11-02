# Shipment-System-Backend

The back-end server of a shipment tracking system

## React front-end repo

[Shipment-System-Frontend](https://github.com/MartinMa28/Shipment-System-Frontend)

## How to deploy

### Clone the front-end and back-end repos

```
cd ~
git clone https://github.com/MartinMa28/Shipment-System-Frontend.git
git clone https://github.com/MartinMa28/Shipment-System-Backend.git
```

### Install Docker and Docker Compose

Please follow the official documentation and install Docker & Docker Compose on your own system.
[Docker Official Installation Documentation](https://docs.docker.com/engine/install/)  
[Docker Compose Official Installation Documentation](https://docs.docker.com/compose/install/)

### Install Node.JS and npm

Actually, if we just want to deploy the back-end, we don't need Node.js and npm because the back-end would be running in docker containers. However, before doing that, we need to compile the front-end project into production codes. That is why we need them over here.

I would use the package management tool to install Node.JS. I am using a Ubuntu server, so it looks like the following:

```
sudo apt-get update
sudo apt-get install nodejs
sudo apt-get install npm
```

### Build the React project into production codes

```
cd ~/Shipment-System-Frontend/
npm install
npm run build
```

### Copy the production build folder to the back-end folder

```
cp -r ./build/ ~/Shipment-System-Backend/
```

### Add environment variables

```
touch .env
```

Add the following environment variables to .env file. Remember to replace the dummy values.

```
PORT=8000
SHIPENGINE_API_KEY=dummy_shipengine_api_key_123456
SESSION_SECRET=dummy_secret
```

### Build & run the back-end in containers

```
cd ~/Shipment-System-Backend/
```

Right now, we have every thing the back-end needs. If you want to print the log on your terminal, run the following commands.

Force build:

```
docker-compose up --build
```

Don't rebuild:

```
docker-compose up
```

If you don't want to have the logs in terminal, then run the container in detached mode.

```
docker-compose up -d
```

### Run the consumer worker

Get into web container, and run the worker.
Note that, in order to load the environment variables, the command must be executed at /code (where .env is at) in the container.

```
docker exec -it shipment-system-backend_web_1 bash
pwd (should be /code)
npx babel-node src/worker.js
```
