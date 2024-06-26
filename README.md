commands to run it locally without Docker.

```bash
    npm install
    docker run --name my-redis -d -p 6379:6379 redis
    npm run dev
```

with Docker

```bash
    docker network create custom
```

```bash
    docker build . -t redis-web
    docker run -d -p 6379:6379 --network custom --name my-redis redis
    docker run -d -p 8000:8000 --network custom --name img-redis-web redis-web
```

<p align="center">
    <img src="https://media.geeksforgeeks.org/wp-content/uploads/20230914185841/redis-publish-subscriber.png" width="350" title="hover text"/>
</p>
Give it a star ⭐️
