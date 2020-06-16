const {saveFile, getData, BOOKINGS_FILE} = require('./data')
const validate = require('./validate')

module.exports = request => {
    const {crew, bookings} =  getData();
    const pilot = crew.find(crewMember => crewMember.ID == request.pilotId)
    if(!pilot || !validate(pilot, request, bookings)) return false
    const booking = {
        location: request.location,
        depDateTime: request.depDateTime,
        returnDateTime: request.returnDateTime
    }
    if(bookings[request.pilotId]) {
        bookings[request.pilotId] = [booking]
    } else {
        bookings[request.pilotId].push(booking)
    }
    saveFile(bookings, BOOKINGS_FILE)
    return true
}