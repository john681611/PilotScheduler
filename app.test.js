const request = require('supertest')
const app = require('./app')


describe('/availability', () => {
    it('should respond', async () => {
        const response = await request(app)
        .post('/availability')
        .expect(200)
    });
});

describe('/book', () => {
    it('should respond', async () => {
        const response = await request(app)
        .post('/book')
        .expect(200)
    });
});

describe('misc', () => {
    it('should respond 404 to unknown method', async () => {
        const response = await request(app)
        .get('/availability')
        .expect(404)
    });

    it('should respond 404 to method url', async () => {
        const response = await request(app)
        .get('/random')
        .expect(404)
    });
});