const path = require('path');
const fastify = require('fastify')({ logger: { level: 'debug' } });
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

// Account data
const accounts = {
    checking: { id: 'checking', balance: 12450.00, currency: 'USD' },
    savings: { id: 'savings', balance: 85200.00, currency: 'USD' },
};

const getAccountBalance = (accountId) => {
    const account = accounts[accountId];
    return account.balance;
};

// Home
fastify.get('/', async (request, reply) => {
    const start = Date.now();
    fastify.log.debug(`📄 Rendering home page for ${request.ip}`);
    fastify.log.debug(`🔧 User-Agent: ${request.headers['user-agent']}`);
    const result = reply.view('index.ejs');
    fastify.log.debug(`⚡ Home page rendered in ${Date.now() - start}ms`);
    return result;
});

// Health
fastify.get('/health', async (request, reply) => {
    const uptime = process.uptime().toFixed(1);
    const memUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1);
    fastify.log.debug(`💓 Health check — uptime: ${uptime}s, memory: ${memUsage}MB, pid: ${process.pid}`);
    return { status: 'ok' };
});

// Core banking endpoints
fastify.get('/api/core-banking/account-summary', async (request, reply) => {
    fastify.log.debug(`💳 Processing balance lookup for premium account`);
    fastify.log.debug(`🔍 Fetching account data from account registry`);
    const balance = getAccountBalance('premium');
    fastify.log.debug(`✅ Balance retrieved: ${balance}`);
    return { balance };
});

fastify.get('/api/core-banking/transfer', async (request, reply) => {
    fastify.log.debug(`📝 Validating transfer request`);
    const { accountId, amount } = request.query;
    if (!accountId) {
        fastify.log.error(`🚫 Validation failed: missing required field "accountId" in transfer request`);
        reply.code(400);
        return { error: 'Missing required field: accountId' };
    }
    return { accountId, amount };
});

module.exports = fastify;
