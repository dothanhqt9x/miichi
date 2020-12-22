const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

var Schema = mongoose.Schema
var UserSchema = new Schema({
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
    // tokens: [{
    //     token: {
    //         type: String,
    //         required: true
    //     }
    // }],
})

UserSchema
    .virtual('url')
    .get(function () {
        return '/catalog/user/' + this._id;
    });

// use show users profile details
// UserSchema.virtual("url").get(function () {
//     return "/catalog/users/" + this._id;
// })

UserSchema.pre('save', async function (next) {
    // Hash the password before saving the user model
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

module.exports = mongoose.model("User", UserSchema)