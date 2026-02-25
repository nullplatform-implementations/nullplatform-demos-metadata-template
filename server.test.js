const server = require('./server');

afterAll(() => server.close());

test('GET /health returns ok', async () => {
    const response = await server.inject({ method: 'GET', url: '/health' });
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual({ status: 'ok' });
});

test('GET / returns 200', async () => {
    const response = await server.inject({ method: 'GET', url: '/' });
    expect(response.statusCode).toBe(200);
    expect(response.body).toContain('Kwiki Bank');
});
