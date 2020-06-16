const request = require('supertest')
const app = require('./app')
const book = require('./book')
const moment = require('moment');
jest.mock('./book')

const defaultDate = moment('2020-04-02T09:00:00Z')
describe('/availability', () => {
    it('should respond', async () => {
        const response = await request(app)
        .post('/availability')
        .expect(200)
    });
});

describe('/book', () => {
    beforeEach(() => {
        book.mockClear()
    });

    it('should respond 400 to no body', async () => {
        const response = await request(app)
        .post('/book')
        .send(null)
        .expect(400)
    });

    it('should respond 200 with good booking', async () => {
        book.mockReturnValueOnce(true)
        const response = await request(app)
        .post('/book')
        .send({
            pilotId: 1,
            location: 'Munich',
            depDateTime: moment(defaultDate).hours(4).toISOString(),
            returnDateTime: moment(defaultDate).hours(8).toISOString()
        })
        .expect(200)
    });

    it('should respond 500 with bad booking', async () => {
        book.mockReturnValueOnce(false)
        const response = await request(app)
        .post('/book')
        .send({
            pilotId: 1,
            location: 'Munich',
            depDateTime: moment(defaultDate).hours(11).toISOString(),
            returnDateTime: moment(defaultDate).hours(12).toISOString()
        })
        .expect(500)
        expect(response.text).toBe('Conflits with existing booking')
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