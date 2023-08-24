import { consumer as memphisConsumer } from './libs/memphis-lib.js'
import { channel as rabbitmqChannel, queue as rabbitmqQueue } from './libs/rabbitmq-lib.js'
import { insertM, insertR } from './libs/db-lib.js'

memphisConsumer.on('message', async (message) => {
  let msgObj = JSON.parse(message.getData().toString())
  //console.log(msgObj)
  await insertM(msgObj)
  message.ack();
});
memphisConsumer.on('error', (error) => {
  console.log(error);
});

rabbitmqChannel.consume(rabbitmqQueue, async (message) => {
  let msgObj = JSON.parse(message.content.toString())
  //console.log(msgObj)
  await insertR(msgObj)
  rabbitmqChannel.ack(message)
}, { noAck: false }) //auto ack=false

console.log("Start Consumer")