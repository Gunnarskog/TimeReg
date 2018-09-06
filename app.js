var express     = require("express"),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    moment      = require("moment");

var app = express();

mongoose.connect("mongodb://localhost:27017/time_reg_db", { useNewUrlParser: true })
var Project = require("./models/project");

app.use(bodyParser.urlencoded({ extended: false }))

app.set('view engine', 'ejs');

// ============ Routes ================
app.get("/", function(req, res) {
    res.redirect("/timereg")
})

app.get("/timereg", function(req, res) {
    Project.find({}, function(err, allProjects) {
        if (err) {
            console.log(err)
        } else {
            res.render("index", { projects: allProjects }, totTime = 0)
        }
    })
})

app.post("/timereg", function(req, res) {
    var name = req.body.name;
    var date = req.body.date;
    var startTime = req.body.startTime;
    var stopTime = req.body.stopTime;

    var datetimeA = moment(req.body.date + " " + startTime);
    var datetimeB = moment(req.body.date + " " + stopTime);
    var timeDiff = datetimeB.diff(datetimeA, 'minutes');

    if (startTime > stopTime) {
        res.send("Cannot choose a earlier stop time than start time!") //Error "handling" of overnight work
    } else {

        Project.findOne({ name: name }, function(err, foundProject) {
            if (err) {
                console.log("Something went wrong: ", err)
            } else if (foundProject) {
                foundProject.dateAndTime.push({ date: date, time: timeDiff })
                foundProject.save();
                console.log("Found project", foundProject)
                res.redirect("/timereg")
            } else {
                var newProject = { name: name, dateAndTime: [{ date: date, time: timeDiff }] }
                Project.create(newProject, function(err, newProject) {
                    if (err) {
                        console.log("Could not create new project: ", err)
                    } else {
                        console.log("Created: ", newProject)
                    }
                    res.redirect("/timereg")
                })
            }
        })
    }
})

app.post("/delete", function(req, res) {
    Project.findById(req.body.del, function(err, foundProject) {
        if (foundProject) {
            foundProject.remove(req.body.del, function(err, project) {
                if (err) {
                    console.log(err)
                } else {
                    console.log("Successfully removed", project)
                }
                res.redirect("/timereg")
            });
        } else {
            res.redirect("/timereg")
        }
    })
})

var server = app.listen(8000, function(req, res) {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Time registration app is listening at http://%s:%s", host, port)
})