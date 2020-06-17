const request = require('supertest')
const app = require('./app')
const book = require('./book')
const moment = require('moment');
const availability = require('./availability')
jest.mock('./book')
jest.mock('./availability')

const defaultDate = moment('2020-04-02T09:00:00Z')
describe('/availability', () => {
    beforeEach(() => {
        availability.mockClear()
    });
    it('should respond 400 to no body', async () => {
        const response = await request(app)
        .post('/availability')
        .send(null)
        .expect(400)
    });

    it('should respond 200 with good availability', async () => {
        availability.mockReturnValueOnce(1)
        const response = await request(app)
        .post('/availability')
        .send({
            location: 'Munich',
            depDateTime: moment(defaultDate).hours(4).toISOString(),
            returnDateTime: moment(defaultDate).hours(8).toISOString()
        })
        .expect(200)
        expect(response.body).toEqual({pilotId: 1})
    });

    it('should respond 500 with bad availability', async () => {
        availability.mockReturnValueOnce(undefined)
        const response = await request(app)
        .post('/availability')
        .send({
            location: 'Munich',
            depDateTime: moment(defaultDate).hours(11).toISOString(),
            returnDateTime: moment(defaultDate).hours(12).toISOString()
        })
        .expect(500)
        expect(response.text).toBe('Request could not be fullfilled')
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
        const booking = {
            pilotId: 1,
            location: 'Munich',
            depDateTime: moment(defaultDate).hours(4).toISOString(),
            returnDateTime: moment(defaultDate).hours(8).toISOString()
        }
        const response = await request(app)
        .post('/book')
        .send(booking)
        .expect(200)
        expect(response.body).toEqual(booking)
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
        expect(response.text).toBe('Request could not be fullfilled')
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