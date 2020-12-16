const { DateTime } = require('luxon')
var mongoose = require('mongoose')

var Schema = mongoose.Schema

// const Genders = Object.freeze({
//     Male: 'male',
//     Female: 'female',
//     Other: 'other',
// })

var UsersSchema = new Schema({
    email: { type: String, required: true, maxlength: 100, unique: true},
    name: { type: String, required: true, maxlength: 100},
    gender: {
        type: String,
        required: true,
        enum: ['Male', 'Female', 'Other'], 
        default: 'Male' 
    },
    password: { type: String, required: true},
    introduce: { type: String},
})

// use show users profile details
UsersSchema.virtual("url").get(function () {
    return "/catalog/users/" + this._id;
})

module.exports = mongoose.model("Users", UsersSchema)