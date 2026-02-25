const path = require('path');
const fastify = require('fastify')({ logger: { level: 'info' } });
const fastifyView = require('@fastify/view');
const fastifyStatic = require('@fastify/static');
const ejs = require('ejs');

fastify.register(fastifyStatic, {
    root: path.join(__dirname, 'public'),
});

fastify.register(fastifyView, {
    engine: { ejs },
    root: path.join(__dirname, 'views'),
});

// Home
fastify.get('/', async (request, reply) => {
    return reply.view('index.ejs');
});

// Health
fastify.get('/health', async (request, reply) => {
    return { status: 'ok' };
});

// Error endpoints
fastify.get('/error500', async (request, reply) => {
    reply.code(500);
    return 'Internal Server Error';
});

fastify.get('/error400', async (request, reply) => {
    reply.code(400);
    return 'Bad Request';
});

module.exports = fastify;
