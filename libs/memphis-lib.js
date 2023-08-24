import { genObj } from './db-lib.js'
import express from 'express'
export const router = express.Router();
import { memphis } from 'memphis-dev'
export let connection, consumer, producer
const stationName = 'hello'
const producerName = 'producer1'
const consumerName = 'consumer1'
const consumerGroup = 'hello_consumer_group'
const connectionObj = {
  host: 'localhost',
  username: 'frappet',
  password: 'Password1!',
  accountId: 1
}
connection = await memphis.connect(connectionObj);
producer = await connection.producer({ stationName, producerName });
//https://docs.memphis.dev/memphis/memphis-broker/concepts/consumer
consumer = await connection.consumer({
  stationName, consumerName, consumerGroup
  , batchSize: 10, prefetch: true, pullIntervalMs: 300  
});
router.post("/", async function (req, res) {
  try {
    let msg = JSON.stringify(genObj(3, req.body.content))
    await producer.produce({ message: Buffer.from(msg) });
    res.send("Post to Memphis Station");
    console.log(msg)
  } catch (ex) {
    console.log(ex);
    res.status(500).send("Fail to Post Memphis Station");
  }
});



