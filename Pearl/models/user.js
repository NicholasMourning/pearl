const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName:{type:String, required:[true, 'First name is required']},
    lastName:{type:String, required:[true, 'Last name is required']},
    email:{type:String, required:[true, 'email adress is required'], unique[true, 'This email address has been used']},
    password:{type:String, required:[true, 'Password is required']}
});


module.exports = mongoose.model('User', userSchema);