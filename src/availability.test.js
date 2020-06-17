const availability = require('./availability')
const { getData } = require('./data')
const moment = require('moment');

jest.mock('./data')

const defaultDate = moment('2020-04-02T09:00:00Z')
describe('availability', () => {
    beforeEach(() => {
        getData.mockReturnValue({
            crew: [
                {
                    ID: 1,
                    Name: "Andy",
                    Base: "Munich",
                    WorkDays: ["Monday", "Tuesday", "Thursday", "Saturday"]
                },
                {
                    ID: 2,
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
            }
        })
    });
    it('should return undefined when no pilot is free', () => {
        expect(availability({
            location: 'Munich',
            depDateTime:  moment(defaultDate).hours(9),
            returnDateTime: moment(defaultDate).hours(12)
        })).toEqual(undefined)
    });

    it('should return pilot ID when only one is free', () => {
        expect(availability({
            location: 'Munich',
            depDateTime:  moment(defaultDate).hours(13),
            returnDateTime: moment(defaultDate).hours(15)
        })).toEqual(1)
    });

    it('should return relatively equal numbers of two available pilots', () => {
        let oneCount = 0
        let twoCount = 0
        for (let index = 0; index < 1000; index++) {
            const result = availability({
                location: 'Munich',
                depDateTime:  moment(defaultDate).hours(4),
                returnDateTime: moment(defaultDate).hours(8)
            })
            switch (result) {
                case 1:
                    oneCount++
                    break;
                case 2:
                    twoCount++
                    break;
                default:
                    expect(result).toBe(false)
                    break;
            }   
        }
        expect(oneCount).toBeLessThan(600)
        expect(twoCount).toBeLessThan(600)
        expect(oneCount + twoCount).toBe(1000)
    });
});