const request = require('supertest')
const app = require('./app')
const {saveFile, BOOKINGS_FILE, getData} = require('./data')
const moment = require('moment');

const defaultDate = moment('2020-04-02T09:00:00Z')
describe('E2E', () => {
    let pilotId
    const booking = {
        location: 'Munich',
        depDateTime: moment(defaultDate).hours(4).toISOString(),
        returnDateTime: moment(defaultDate).hours(8).toISOString()
    }
    beforeAll(() => {
        saveFile({
            1: [{
                location: 'Munich',
                depDateTime: moment(defaultDate).hours(9),
                returnDateTime: moment(defaultDate).hours(12)
            }],
            2: [{
                location: 'Munich',
                depDateTime: moment(defaultDate).hours(9),
                returnDateTime: moment(defaultDate).hours(12)
            },
            {
                location: 'Munich',
                depDateTime:  moment(defaultDate).hours(13),
                returnDateTime: moment(defaultDate).hours(15)
            }]
        },BOOKINGS_FILE)
    });

    afterAll(() => {
        saveFile({}, BOOKINGS_FILE) 
    });

    it('should give me the availability of a pilot', async () => {
        const response = await request(app)
        .post('/availability')
        .send(booking)
        .expect(200)
        expect(response.body.pilotId).toBeTruthy()
        pilotId = response.body.pilotId
    });

    it('should reject no pilot in city', async () => {
        const response = await request(app)
        .post('/availability')
        .send({...booking, location: 'Alderan'})
        .expect(500)
        expect(response.text).toBe('Request could not be fullfilled')
    });

    it('should book the flight for me with that pilot', async () => {
        const response = await request(app)
        .post('/book')
        .send({...booking, pilotId})
        .expect(200)
        expect(response.body).toEqual(booking)
    });

    it('should reject a repeated booking request', async () => {
        const response = await request(app)
        .post('/book')
        .send({...booking, pilotId})
        .expect(500)
        expect(response.text).toBe('Request could not be fullfilled')
    });

    it('should have my booking in the data', () => {
        const {bookings} = getData()
        console.log(pilotId)
        expect(bookings[pilotId]).toContainEqual(booking)
    });
});