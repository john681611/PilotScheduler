 
const {writeFileSync, readFileSync} = require('fs');
const {resolve} = require('path');
const CREW_FILE = './src/data/Crew.json',
BOOKINGS_FILE = './src/data/Bookings.json'
const findIndex = (obj, id) => {
    return obj.findIndex(el => el.id.toString() === id.toString());
};

const saveFile = (obj, filePath) => {
            writeFileSync(filePath, JSON.stringify(obj));
};

const getFile = (file) => {
    return JSON.parse(readFileSync(resolve(file), 'utf8'));
};

const getData = () => ({
    crew: getFile(CREW_FILE),
    bookings: getFile(BOOKINGS_FILE)
})


module.exports = {
    saveFile,
    findIndex,
    getData,
    CREW_FILE,
    BOOKINGS_FILE
};