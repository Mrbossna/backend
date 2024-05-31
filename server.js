const fastify = require('fastify')({ logger: true });
const fastifyCors = require('@fastify/cors');
const fastifyMongo = require('@fastify/mongodb');
const dotenv = require('dotenv');
dotenv.config();
// เปิดใช้ CORS
fastify.register(fastifyCors, {
  origin: '*'
});

// เชื่อมต่อกับ MongoDB
// fastify.register(fastifyMongo, {
//   url: `${process.env.MONGODB}`
// });


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
  const collection = fastify.mongo.db.collection('list');
  const result = await collection.insertOne(request.body);
  reply.send(result);
})

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
