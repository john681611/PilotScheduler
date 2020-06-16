const book = require('./book')
const { BOOKINGS_FILE, saveFile, getData } = require('./data')
const moment = require('moment');

jest.mock('./data')

const defaultDate = moment('2020-04-02T09:00:00Z')
describe('book', () => {
    beforeEach(() => {
        getData.mockReturnValue({
            crew: [
                {
                    ID: 1,
                    Name: "Andy",
                    Base: "Munich",
                    WorkDays: ["Monday", "Tuesday", "Thursday", "Saturday"]
                }
            ],
            bookings: {
                1: [{
                    location: 'Munich',
                    depDateTime: moment(defaultDate).hours(9),
                    returnDateTime: moment(defaultDate).hours(12)
                }]
            }
        })
    });

    afterEach(() => {
        saveFile.mockClear()
    });

    it('should book a valid pilot and return true', () => {
        const booking = {
            pilotId: 1,
            location: 'Munich',
            depDateTime: moment(defaultDate).hours(4),
            returnDateTime: moment(defaultDate).hours(8)
        }
        expect(book(booking)).toBe(true)
        expect(saveFile.mock.calls[0][0]).toEqual({1:[{
            location: booking.location,
            depDateTime: booking.depDateTime,
            returnDateTime: booking.returnDateTime
        }]})
        expect(saveFile.mock.calls[0][1]).toEqual(BOOKINGS_FILE)
    });

    it('should not book a invalid pilot and return false', () => {
        expect(book({
            pilotId: 2,
            location: 'Munich',
            depDateTime: defaultDate,
            returnDateTime: defaultDate
        })).toBe(false)
        expect(saveFile.mock.calls.length).toBe(0)
    });

    it('should not book a conflicting booking and return false', () => {
        expect(book({
            pilotId: 1,
            location: 'Munich',
            depDateTime: moment(defaultDate).hours(8),
            returnDateTime: moment(defaultDate).hours(11)
        })).toBe(false)
        expect(saveFile.mock.calls.length).toBe(0)
    })
});