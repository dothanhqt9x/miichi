// const { DateTime } = require('luxon')

const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

var Schema = mongoose.Schema

// const Genders = Object.freeze({
//     Male: 'male',
//     Female: 'female',
//     Other: 'other',
// })

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
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
})

// use show users profile details
UserSchema.virtual("url").get(function () {
    return "/catalog/users/" + this._id;
})

UserSchema.pre('save', async function (next) {
    // Hash the password before saving the user model
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

UserSchema.methods.generateAuthToken = async function() {
    // Generate an auth token for the user
    const user = this
    const token = jwt.sign({_id: user._id}, process.env.JWT_KEY)
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}


//tim cac cap email và pw phù hợp
UserSchema.statics.findByCredentials = async (email, password) => {
    // Search for a user by email and password.
    const user = await User.findOne({ email} )
    if (!user) {
        throw new Error({ error: 'Invalid login credentials' })
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if (!isPasswordMatch) {
        throw new Error({ error: 'Invalid login credentials' })
    }
    return user
}

module.exports = mongoose.model("User", UserSchema)