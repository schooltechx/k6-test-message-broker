import express from 'express'
import { router as memphis_route } from './libs/memphis-lib.js'
import { router as rabbitmq_route } from './libs/rabbitmq-lib.js'
import { insertD, clearDB,genObj } from './libs/db-lib.js'
const app = express()
const port = 3000
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/', (req, res) => res.send('Hello World!'));
app.get('/cleardb', async (req, res) => {res.send("Delete " + await clearDB())});
app.use("/memphis", memphis_route)
app.use("/rabbitmq", rabbitmq_route)
app.post("/db", async function (req, res) {
    try{
        await insertD(genObj(1,req.body.content))
        res.status(200).send("Post to Database")    
    } catch (ex) {
        console.log(ex);
        res.status(500).send("Write Database Fail")
    }
});
app.listen(port, () => console.log(`app run on port ${port}!`));

