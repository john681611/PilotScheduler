
const { getData } = require('./data')
const validate = require('./validate')


// Balancing this is the hardest part we first find who is available
// We can't balance on fewest bookings first due various lengths of bookings
// We could balance on hours available in the day but then trips over night are awkward
// Considering that its just balancing requests then random should do as overtime chance means they should balance
module.exports = request => {
    const {crew, bookings} =  getData();
    const availablePilots = crew.filter(pilot => validate(pilot, request, bookings))
        .map(pilot => pilot.ID)
    return availablePilots[Math.floor(Math.random() * availablePilots.length)]
}