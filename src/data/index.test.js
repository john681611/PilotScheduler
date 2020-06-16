const data = require('./');
const fs = require('fs');
const path = require('path');

jest.mock('fs')

describe('File Mod Funcs', function () {
    const file = './data/testOBJ.json';
    beforeEach(() => {
        fs.writeFileSync.mockReturnValue(null)
    });

    describe('saveFile', function () {

        it('should add new item to empty file', function () {
            const obj = {
                id: '-1',
                name: 'bob'
            }
            const expected = JSON.stringify(obj);
            data.saveFile(obj, file);
            expect(fs.writeFileSync.mock.calls[0][0]).toEqual(file);
            expect(fs.writeFileSync.mock.calls[0][1]).toEqual(expected);
        });
    })
});

describe('findIndex', function () {
    var req = [{ id: 2 }, { id: '1' }, { id: '0' }];
    it('should find by ID not index', function () {

        expect(data.findIndex(req, '1') === 1);
    });

    it('should return -1 when not found', function () {
        expect(data.findIndex(req, '3') === -1);
    });

    it('should deal with num and string', function () {
        expect(data.findIndex(req, '2') === 0);
    });
});


describe('getData', function () {
    beforeEach(() => {
        fs.readFileSync.mockReturnValue('[{"date":"2018-01-28"}]')
    })

    it('should return a set of objects', function () {
        const expectedCalls = [
            './data/Crew.json',
            './data/Bookings.json'
        ];

        const result = data.getData();
        expect(fs.readFileSync).toHaveBeenCalledTimes(2)
        expect(typeof result).toBe('object');
        expectedCalls.forEach((call, index) => {
            expect(fs.readFileSync.mock.calls[index][0]).toEqual(path.resolve(call));
        });
    });

    it('should update when files change', function () {
        const inital = data.getData();
        fs.readFileSync.mockReturnValue('[{"date":"2019-01-28"}]');
        const after = data.getData();
        expect(after).not.toEqual(inital);
    });
})
