const express = require("express");
const Queue = require("bull");
const { createBullBoard } = require("@bull-board/api");
const { BullAdapter } = require("@bull-board/api/bullAdapter");
const { ExpressAdapter } = require("@bull-board/express");
const bodyParser = require("body-parser");
require("dotenv").config();

const PORT = 3002;

const queueConnectionOpts = {
  redis: {
    host: "localhost",
    port: 6379,
    connectTimeout: 30000,
  },
  prefix: "queue-pref",
  defaultJobOptions: {
    removeOnComplete: false,
  },
};

const myQueue = new Queue("my-queue", queueConnectionOpts);
const serverAdapter = new ExpressAdapter();

createBullBoard({
  queues: [new BullAdapter(myQueue)],
  serverAdapter,
});

const app = express();
serverAdapter.setBasePath("/bull-ui");

app.use(bodyParser.urlencoded({ extended: false }));

app.use("/bull-ui", serverAdapter.getRouter());

app.listen(PORT, () => {
  console.log(`Bull UI, http://localhost:${PORT}/bull-ui`);
});
