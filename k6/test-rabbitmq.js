import http from 'k6/http';
import { check, sleep } from 'k6';
export const options = {
    stages: [
        { duration: '5s', target: 10000 },
    ],
};
export default function () {
    const data = JSON.stringify({ content: "Hello RabbitMQ" })
    const res = http.post('http://192.168.2.100:3000/rabbitmq', data, {
        headers: { 'Content-Type': 'application/json' },
    });
    check(res, { 'status was 200': (r) => r.status == 200 });
    sleep(0.1);
}