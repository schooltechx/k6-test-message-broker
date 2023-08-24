# Message Broker Test
ทดสอบประสิทธิ์ภาพ Message Broker ระหว่าง RabbitMQ และ Memphis

# ติดตั้ง

```
docker network create mq
docker compose up -d
mkdir mq 
cd mq
# สร้างโปรเจ็กแล้วใส่โค้ดหรือ clone project 
npm init -y
npm install amqplib memphis-dev express 
npm install @types/amqplib @types/express prisma --save-dev
npx prisma init --datasource-provider postgresql
code .
# แก้ compose.yaml 
docker compose up -d
# .env, prisma/schema.prisma
npx prisma migrate dev --name init
npx prisma studio
node app.js
node consumer.js
```
## Configuration ต่างๆ
- [compose.yaml](./compose.yaml) postgress, RabbitMQ, Memphis 
- [.env](./.env) connection string ใช้ postgressql หรือ sqlite (ไม่แนะนำ เพราะช้ามากตอนเขียน)
```
# DATABASE_URL="file:./dev.db"
DATABASE_URL="postgresql://frappet:password@localhost:5432/mq?schema=public"
```
- [prisma/schema.prisma](./prisma/schema.prisma) เพิ่ม m กับ r สำหรับ memphis กับ rabbitmq
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
- [package.json](./package.json) เพิ่มบรรทัดนี้ใน 
```
  "type":"module",
```


## Code โปรแกรม
- [./lib/db-lib.js] ฟังก์ชั่นเกี่ยวกับเขียนลงฐานของมูล(Prisma)
- [./lib/memphis-lib.js] ฟังก์ชั่นเกี่ยวกับ memphis
- [./lib/rabbitmq-lib.js] ฟังก์ชั่นเกี่ยวกับ rabbitmq

## Test
GET เข้าเวปสอง url นี้
- http://localhost:3000/memphis
- http://localhost:3000/rabbitmq

POST
```
curl -X POST -H "Content-Type: application/json" -d '{"key":"value"}' http://localhost:3000/memphis
curl -X POST -H "Content-Type: application/json" -d '{"key":"value"}' http://localhost:3000/rabbitmq
```

ทดสอบด้วย [k6](https://k6.io/) ติดตั้งให้เรียบร้อย รันสคริปต์ทดสอบ แก้ vus และ duration ให้เหมาะสม
- [test/stress-rabbitmq.js](./test/stress-rabbitmq.js)
- [test/stress-memphis.js](./test/stress-memphis.js)

จะได้ผลดังนี้ 
```
$ k6 run stress-memphis.js 

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
Memphis consumer batchSize:10 ทีละ 10 หน่วยความจำที่ใช้

```
CONTAINER ID   NAME                    CPU %     MEM USAGE / LIMIT   MEM %     NET I/O           BLOCK I/O         PIDS
14ccdd79e656   mq-memphis-1            1.81%     271.8MiB / 10GiB    2.65%     42.5MB / 68.4MB   51.7MB / 594MB    11
4f7c65825fb8   mq-postgres-1           1.30%     50.88MiB / 10GiB    0.50%     13.7MB / 13.3MB   6.48MB / 2.2GB    11
b20a00e76473   rabbitmq                0.35%     117.7MiB / 10GiB    1.15%     12.4MB / 13MB     4.85MB / 36.6MB   30
456e17bc21b4   mq-memphis-metadata-1   0.09%     30.07MiB / 10GiB    0.29%     7.86MB / 11.3MB   770kB / 115MB     8
```


```
CONTAINER ID   NAME                    CPU %     MEM USAGE / LIMIT   MEM %     NET I/O           BLOCK I/O         PIDS
14ccdd79e656   mq-memphis-1            0.89%     265.4MiB / 10GiB    2.59%     43MB / 69.4MB     51.7MB / 606MB    11
4f7c65825fb8   mq-postgres-1           0.04%     50.59MiB / 10GiB    0.49%     15.1MB / 14.6MB   6.51MB / 2.37GB   11
b20a00e76473   rabbitmq                0.28%     155.5MiB / 10GiB    1.52%     14MB / 14.7MB     4.85MB / 44.4MB   30
456e17bc21b4   mq-memphis-metadata-1   0.00%     30.23MiB / 10GiB    0.30%     7.91MB / 11.4MB   770kB / 116MB     8
```