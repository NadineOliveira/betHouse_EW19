var mongoose = require('mongoose')
var Schema = mongoose.Schema

var EventSchema = new Schema({
    author: {type: String, required: true},
    local: {type: String, required: true},
    theme: {type: String, required: true},
    description: {type: String},
    date: {type: String, required: true},
    hour: {type: String, required: true},
    duration: {type: Number, required: true},
    interested: {type: [String]}
})

module.exports = mongoose.model('Event', EventSchema, 'events')