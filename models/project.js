var mongoose = require("mongoose");

var ProjectSchema = new mongoose.Schema({
    name: String,
    dateAndTime: [{ date: Date, time: Number }]
});


var Project = mongoose.model("Project", ProjectSchema);

module.exports = Project;