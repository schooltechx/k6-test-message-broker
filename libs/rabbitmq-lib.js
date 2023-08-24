import { genObj } from './db-lib.js'
import express from 'express'
export const router = express.Router();
import { connect } from "amqplib";
export const queue = "hello"
export let connection, channel
connection = await connect("amqp://frappet:password@localhost")
channel = await connection.createChannel();
await channel.assertQueue(queue, { durable: true })
channel.prefetch(10) // QOS
router.post("/", async function (req, res) {
    let msg = JSON.stringify(genObj(2, req.body.content))
    try {
        channel.sendToQueue(queue, Buffer.from(msg), { persistent: true })
        res.status(200).send("Post to RabbitMQ queue");
        console.log(msg)
    } catch (ex) {
        console.log(ex);
        res.status(500).send("Fail to Post RabbitMQ queue");
    }
});
