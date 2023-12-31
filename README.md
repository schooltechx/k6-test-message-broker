# Load test Database, Memphis and RabbitMQ


Load Test RabbitMQ and Memphis with K6 (Thai language) 

[![Load Test RabbitMQ and Memphis with K6](https://img.youtube.com/vi/7KKoXFLqavE/0.jpg)](https://youtu.be/7KKoXFLqavE "Load Test RabbitMQ และ Memphis ด้วย K6")


# Setup
clone or copy code to correct position. How to setup please see below command

```
docker network create mq
docker compose up -d
mkdir mq 
cd mq
# how to init project 
npm init -y
npm install amqplib memphis-dev express 
npm install @types/amqplib @types/express prisma --save-dev
npx prisma init --datasource-provider postgresql
code .
# edit compose.yaml 
docker compose up -d
# .env, prisma/schema.prisma
npx prisma migrate dev --name init
npx prisma studio
node app.js
node consumer.js

```

## Configuration 
- [compose.yaml](./compose.yaml) Postgress, RabbitMQ, Memphis 
- [.env](./.env) connection string for postgressql or sqlite (very slow)
```
# DATABASE_URL="file:./dev.db"
DATABASE_URL="postgresql://frappet:password@localhost:5432/mq?schema=public"
```
- [prisma/schema.prisma](./prisma/schema.prisma) add model m , r, d
```
model m {
  id    Int     @id @default(autoincrement())
  userId Int 
  data String 
  createdAt DateTime  @default(now())
}
model r {
  id    Int     @id @default(autoincrement())
  userId Int 
  data String 
  createdAt DateTime  @default(now())
}
```
- [package.json](./package.json) add this line 
```
  "type":"module",
```


## Code 

- [./lib/db-lib.js] Database library (Prisma+postgress)
- [./lib/memphis-lib.js] memphis library
- [./lib/rabbitmq-lib.js] Rabbitmq library

## API end point
```
curl -X POST -H "Content-Type: application/json" -d '{"content":"value"}' http://localhost:3000/memphis
curl -X POST -H "Content-Type: application/json" -d '{"content":"value"}' http://localhost:3000/rabbitmq
curl -X POST -H "Content-Type: application/json" -d '{"content":"value"}' http://localhost:3000/db
```

# K6 Test
install [k6](https://k6.io/) modify vus and duration in script file and run
- [k6/test-rabbitmq.js](./k6/test-rabbitmq.js)
- [k6/test-memphis.js](./k6/test-memphis.js)
- [k6/test-db.js](./k6/test-db.js)

```
$ k6 run test-memphis.js 

          /\      |‾‾| /‾‾/   /‾‾/   
     /\  /  \     |  |/  /   /  /    
    /  \/    \    |     (   /   ‾‾\  
   /          \   |  |\  \ |  (‾)  | 
  / __________ \  |__| \__\ \_____/ .io

  execution: local
     script: stress-memphis.js
     output: -

  scenarios: (100.00%) 1 scenario, 4000 max VUs, 35s max duration (incl. graceful stop):
           * default: 4000 looping VUs for 5s (gracefulStop: 30s)


     ✓ status was 200

     checks.........................: 100.00% ✓ 8534       ✗ 0     
     data_received..................: 2.1 MB  59 kB/s
     data_sent......................: 1.5 MB  42 kB/s
     http_req_blocked...............: avg=291.48ms min=1.94µs   med=8.06µs  max=7.19s    p(90)=755.43ms p(95)=791.61ms
     http_req_connecting............: avg=290.59ms min=0s       med=0s      max=7.13s    p(90)=754.75ms p(95)=790.8ms 
     http_req_duration..............: avg=2.31s    min=3.8ms    med=2.05s   max=32.76s   p(90)=2.88s    p(95)=5.57s   
       { expected_response:true }...: avg=2.31s    min=3.8ms    med=2.05s   max=32.76s   p(90)=2.88s    p(95)=5.57s   
     http_req_failed................: 0.00%   ✓ 0          ✗ 8534  
     http_req_receiving.............: avg=84.26µs  min=23.92µs  med=49.16µs max=104.85ms p(90)=80.67µs  p(95)=107.66µs
     http_req_sending...............: avg=15.02ms  min=7.83µs   med=69.51µs max=322.74ms p(90)=73.71ms  p(95)=96.33ms 
     http_req_tls_handshaking.......: avg=0s       min=0s       med=0s      max=0s       p(90)=0s       p(95)=0s      
     http_req_waiting...............: avg=2.29s    min=3.64ms   med=2.04s   max=32.76s   p(90)=2.88s    p(95)=5.55s   
     http_reqs......................: 8534    243.819152/s
     iteration_duration.............: avg=2.57s    min=490.18ms med=2.64s   max=7.81s    p(90)=3.18s    p(95)=5.96s   
     iterations.....................: 8500    242.847761/s
     vus............................: 34      min=0        max=4000
     vus_max........................: 4000    min=2525     max=4000


running (35.0s), 0000/4000 VUs, 8500 complete and 34 interrupted iterations
default ✓ [======================================] 4000 VUs  5s

```

Memphis when Load test

```
CONTAINER ID   NAME                    CPU %     MEM USAGE / LIMIT   MEM %     NET I/O           BLOCK I/O         PIDS
14ccdd79e656   mq-memphis-1            1.81%     271.8MiB / 10GiB    2.65%     42.5MB / 68.4MB   51.7MB / 594MB    11
4f7c65825fb8   mq-postgres-1           1.30%     50.88MiB / 10GiB    0.50%     13.7MB / 13.3MB   6.48MB / 2.2GB    11
b20a00e76473   rabbitmq                0.35%     117.7MiB / 10GiB    1.15%     12.4MB / 13MB     4.85MB / 36.6MB   30
456e17bc21b4   mq-memphis-metadata-1   0.09%     30.07MiB / 10GiB    0.29%     7.86MB / 11.3MB   770kB / 115MB     8
```



More

- Basic using RabbitMQ (Thai language)
[![Basic RabbitMQ](https://img.youtube.com/vi/2vcApGyfiVs/0.jpg)](https://youtu.be/2vcApGyfiVs "Basic RabbitMQ")
