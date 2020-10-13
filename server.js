const app = require('./app');
const http = require('http');
const logger = require('./logging/logger');
const { promisify } = require("util");
const redis = require("redis")
const socket = require("socket.io");

const PORT = process.env.PORT || 8080;

const server = http.createServer(app);

const serv = server.listen(PORT, () => {
  logger.info(`started server on port ${PORT}`);
});

// Connecting to redis
const client = redis.createClient(process.env.REDIS_URL);
client.on('connect', () => {
  logger.info('Redis Client Connected');
});
client.on('error', (err) => {
  logger.error('Something went wrong ' + err);
});

// Creating callbacks to promises
const redisSet = promisify(client.set).bind(client);
const redisGet = promisify(client.get).bind(client);
const redisDel = promisify(client.del).bind(client);

const increment = async (option_id) => {
  try {
    let stat = await redisGet(option_id);
    logger.info(stat);
    if (stat == null) {
      await redisSet(option_id, 1);
      return {
        stat: 1,
        _id: option_id
      }
    }
    stat = parseInt(stat);
    stat += 1;
    logger.info("Updated Stat" + stat);
    await redisSet(option_id, stat);
    return {
      stat: stat,
      _id: option_id
    }
  } catch (err) {
    logger.error(err.toString());
  }
}

const clean = async (option_ids) => {
  try {
    for (let _id of option_ids) {
      await redisDel(_id);
    }
  } catch (err) {
    logger.error(err.toString());
  }
}

const restore = async (option_ids) => {
  try {
    for (let _id of option_ids) {
      await redisSet(_id, 0);
    }
  } catch (err) {
    logger.error(err.toString());
  }
}

const io = socket(serv);

io.on("connection", sc => {
  logger.info("Connected");
  sc.on("disconnect", () => {
    logger.info("Disconnected");
  });
  sc.on("option", async option_id => {
    let dataToEmit = await increment(option_id);
    logger.info(dataToEmit);
    io.sockets.emit("all options", dataToEmit);
  });
  sc.on("next question", data => {
    io.sockets.emit("next", data);
  })
  sc.on("close quiz", async data => {
    await clean(data);
    io.sockets.emit("quiz ended", data[0]);
  })
  sc.on("reset options", async data => {
    await restore(data);
  })
});