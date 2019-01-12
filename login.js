// Schema för lagring i MongoDB
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var loginSchema = new Schema({
    username: String,
    password: String
},
{
    collection: 'login'
});

module.exports = mongoose.model("Login", loginSchema);