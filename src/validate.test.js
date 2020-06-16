const validate = require('./validate')
const moment = require('moment');

const pilotObj =  {
    ID: 1,
    Name: 'Andy',
    Base: 'Munich',
    WorkDays: [
      'Monday',
      'Tuesday',
      'Thursday',
      'Saturday'
    ]
  }

const defaultDate = moment('2020-04-02T09:00:00Z')
const bookings = {
    1: [
        {
            location: 'Munich',
            depDateTime: moment(defaultDate).hours(9),
            returnDateTime: moment(defaultDate).hours(12)
        }
    ]
}
describe('validate', () => {
    it('should return false given bad location', () => {
        expect(validate(pilotObj, {
            location: 'London',
            depDateTime: defaultDate,
            returnDateTime: defaultDate
        }, bookings)).toBe(false)
    });

    it('should return false if not working on dep time', () => {
        expect(validate(pilotObj, {
            location: 'Munich',
            depDateTime: moment('2020-05-01T09:00:00Z'),//friday
            returnDateTime: defaultDate
        }, bookings)).toBe(false)
    });

    it('should return false if not working on return time', () => {
        expect(validate(pilotObj, { 
            location: 'Munich',
            depDateTime: defaultDate,
            returnDateTime: moment('2020-05-01T09:00:00Z'),//friday
        }, bookings)).toBe(false)
    });

    it('should return false if booked exact time period', () => {
        expect(validate(pilotObj, bookings[1][0], bookings)).toBe(false)
    });

    it('should return false if starting same time as booking end', () => {
        expect(validate(pilotObj, {
            location: 'Munich',
            depDateTime: moment(defaultDate).hours(12),
            returnDateTime: moment(defaultDate).hours(13)
        }, bookings)).toBe(false)
    });

    it('should return false if end same time as booking start', () => {
        expect(validate(pilotObj, {
            location: 'Munich',
            depDateTime: moment(defaultDate).hours(3),
            returnDateTime: moment(defaultDate).hours(10) //BST
        }, bookings)).toBe(false)
    });

    it('should return false if ends during booking', () => {
        expect(validate(pilotObj, {
            location: 'Munich',
            depDateTime: moment(defaultDate).hours(3),
            returnDateTime: moment(defaultDate).hours(11) //BST
        }, bookings)).toBe(false)
    });

    it('should return false if starts during booking', () => {
        expect(validate(pilotObj, {
            location: 'Munich',
            depDateTime: moment(defaultDate).hours(11),
            returnDateTime: moment(defaultDate).hours(20) //BST
        }, bookings)).toBe(false)
    });

    it('should return false if within booking booking', () => {
        expect(validate(pilotObj, {
            location: 'Munich',
            depDateTime: moment(defaultDate).hours(10),
            returnDateTime: moment(defaultDate).hours(11) //BST
        }, bookings)).toBe(false)
    });


    it('should return true given good location, workingDate and before bookings', () => {
        expect(validate(pilotObj, {
            location: 'Munich',
            depDateTime: moment(defaultDate).hours(7),
            returnDateTime: moment(defaultDate).hours(8) //BST
        }, bookings)).toBe(true)
    });

    it('should return true given good location, workingDate and after bookings', () => {
        expect(validate(pilotObj, {
            location: 'Munich',
            depDateTime: moment(defaultDate).hours(13),
            returnDateTime: moment(defaultDate).hours(14) //BST
        }, bookings)).toBe(true)
    });
});