var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: {
        type: String,
        unique: true,
        required: true,
        validate: {
            validator: function(v) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: "Please enter a valid email"
        },
    },
    password: { type: String, required: true },
    DOB: { type: Date, required: true },
    number: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /[2-9]{2}\d{8}/.test(v);
            },
            message: 'Provided phone number is invalid.'
        },
    }
});






module.exports = mongoose.model('User', userSchema);