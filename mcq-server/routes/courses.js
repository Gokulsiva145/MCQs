var express = require("express");
var sql = require("mssql");
var router = express.Router();
var url = require("url");
var querystring = require("querystring");
var commonFn = require("./common");

router.get("/all", function (req, res, next) {
    var request = new sql.Request();
    request.query("SELECT * FROM COURSES", function (err, data) {
        if (err) {
            return console.error(err);
        }
        res.send(data.recordset);
    });
});


router.get("/filtered", function (req, res, next) {
    var request = new sql.Request();
    var condition = url.parse(req.url).query;
    let parsedQs = querystring.parse(condition);

    request.query(
        "SELECT * FROM COURSES WHERE " + commonFn.where(parsedQs),
        function (err, data) {
            if (err) {
                return console.error(err);
            }
            res.send(data.recordset);
        }
    );
});


router.post("/add", function (req, res, next) {
    var request = new sql.Request();
    const { courseCode, groupName } = req.body;
    request.query(
        "INSERT INTO COURSES (courseCode, groupName) VALUES('" + courseCode + "','" + groupName + "')",
        function (err, data) {
            if (err) {
                res.send(err);
                if (err.originalError.info.number == 2627) {
                    return console.log("Duplicate Course Code");
                }
                return console.error(err);
            }
            res.send(data.rowsAffected);
        }
    );
});

router.post("/edit", function (req, res, next) {
    var request = new sql.Request();
    const { courseCode, groupName } = req.body;
    request.query(
        "UPDATE COURSES SET groupName='" + groupName + "' WHERE courseCode='" + courseCode + "'",
        function (err, data) {
            if (err) {
                return console.error(err);
            }
            res.send(data.rowsAffected);
        }
    );
});

router.delete('/remove', function (req, res, next) {
    var request = new sql.Request();
    const { courseCodes } = req.body;
    var values = "('" + courseCodes.join("','") + "')";
    request
        .query("DELETE FROM COURSES WHERE courseCode IN " + values, function (
            err,
            data,
        ) {
            if (err) {
                return console.error(err);
            }
            res.send(data.recordset);
        });

})

router.delete('/:courseCode', function (req, res, next) {
    var request = new sql.Request();
    request.query("DELETE FROM COURSES WHERE courseCode='" + req.params.courseCode + "'",
        function (err, data) {
            if (err) {
                return console.error(err);
            }
            res.send(data.rowsAffected);
        }
    );
})

module.exports = router;
