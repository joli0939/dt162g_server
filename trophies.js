// Schema för lagring i MongoDB
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var trophiesSchema = new Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    value: {type: String, required: true},
    date: {type: Date, required: true},
    game: {type: String, required: true},
    link: {type: String, required: true}
});

module.exports = mongoose.model("Trophies", trophiesSchema);