# for service machine
#!/bin/bash
set -e

CLIENT_SERVICE="client"
SERVER_SERVICES="server mongo redis"
COMPOSE_FILES="-f docker-compose.yml -f docker-compose.prod.yml"

if [ -f .env ]; then
  echo "Loading .env..."
  set -a
  source .env
  set +a
else
  echo "Error: .env file not found."
  exit 1
fi

function start() {
  echo "Starting server containers..."
  docker-compose $COMPOSE_FILES up -d $SERVER_SERVICES

  echo "Starting client container..."
  docker-compose $COMPOSE_FILES up -d $CLIENT_SERVICE

  echo "Start complete."
}

function stop() {
  echo "Stopping and removing all containers..."
  docker-compose $COMPOSE_FILES down
  echo "Stop complete."
}

function restart() {
  echo "Restarting containers..."
  stop
  start
  echo "Restart complete."
}

function pull() {
  echo "Removing old images (if exist)..."
  docker image rm -f newmri/nyanspace-client:latest || true
  docker image rm -f newmri/nyanspace-server:latest || true

  echo "Pulling latest images..."
  docker pull newmri/nyanspace-client:latest
  docker pull newmri/nyanspace-server:latest

  echo "Pruning dangling images..."
  docker image prune -f

  echo "Pull complete."
}

if [ -z "$1" ]; then
  echo "Usage: $0 {start|stop|restart|pull}"
  exit 1
fi

case "$1" in
  start) start ;;
  stop) stop ;;
  restart) restart ;;
  pull) pull ;;
  *) echo "Usage: $0 {start|stop|restart|pull}" ;;
esac