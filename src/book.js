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
    if(request.pilotId in bookings) {
        bookings[request.pilotId].push(booking)
    } else {
        bookings[request.pilotId] = [booking]
    }
    saveFile(bookings, BOOKINGS_FILE)
    return true
}