const moment = require('moment');


const existingBooking = (booking, request) => {
    return moment(request.depDateTime).isBetween(booking.depDateTime, booking.returnDateTime, undefined, '[]') ||
    moment(request.returnDateTime).isBetween(booking.depDateTime, booking.returnDateTime, undefined, '[]')
}

module.exports = (pilotObj, request, bookings) => {
    return pilotObj.Base === request.location &&
    pilotObj.WorkDays.includes(moment(request.depDateTime).format('dddd')) &&
    pilotObj.WorkDays.includes(moment(request.returnDateTime).format('dddd')) &&
    !bookings[pilotObj.ID].find(booking => existingBooking(booking, request))

}