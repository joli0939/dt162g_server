// Schema för lagring i MongoDB
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var trophiesSchema = new Schema({
    name: String,
    description: String,
    value: String,
    date: Date,
    game: String,
    link: String
});

module.exports = mongoose.model("Trophies", trophiesSchema);