.PHONY: build up down clean

build:
	docker-compose build

up:
	docker-compose up --build

down:
	docker-compose down

clean:
	docker-compose down --rmi all --volumes --remove-orphans
