var express = require("express");
var sql = require("mssql");
var router = express.Router();
var url = require("url");

router.get("/all", function (req, res, next) {
    var request = new sql.Request();
    request.query("SELECT * FROM SUBJECTS ", function (err, data) {
        if (err) {
            return console.error(err);
        }
        res.send(data.recordset);
    });
});

router.post("/add", function (req, res, next) {
    var request = new sql.Request();
    const { subjectCode, subjectName } = req.body;
    request.query(
        "INSERT INTO SUBJECTS (subjectCode, subjectName) VALUES('" + subjectCode + "','" + subjectName + "')",
        function (err, data) {
            if (err) {
                res.send(err);
                if (err.originalError.info.number == 2627) {
                    return console.log("Duplicate Subject Code");
                }
                return console.error(err);
            }
            res.send(data.rowsAffected);
        }
    );
});

router.post("/edit", function (req, res, next) {
    var request = new sql.Request();
    const { subjectCode, subjectName } = req.body;
    request.query(
        "UPDATE SUBJECTS SET subjectName='" + subjectName + "' WHERE subjectCode='" + subjectCode + "'",
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
    const { subjectCodes } = req.body;
    var values = "('" + subjectCodes.join("','") + "')";
    request
        .query("DELETE FROM SUBJECTS WHERE subjectCode IN " + values , function (
            err,
            data,
        ) {
            if (err) {
                return console.error(err);
            }
            res.send(data.recordset);
        });

})

router.delete('/:subjectCode', function (req, res, next) {
    var request = new sql.Request();
    request.query("DELETE FROM SUBJECTS WHERE subjectCode='" + req.params.subjectCode + "'",
        function (err, data) {
            if (err) {
                return console.error(err);
            }
            res.send(data.rowsAffected);
        }
    );
})
module.exports = router;
