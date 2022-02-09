var express = require("express");
var sql = require("mssql");
var router = express.Router();
var url = require("url");
var querystring = require("querystring");
var commonFn = require("./common");

router.get("/filter", function (req, res, next) {
    var request = new sql.Request();
    var condition = url.parse(req.url).query;
    let parsedQs = querystring.parse(condition);

    request.query(
        "SELECT * FROM EXAMFOR WHERE " + commonFn.where(parsedQs),
        function (err, data) {
            if (err) {
                return console.error(err);
            }
            res.send(data.recordset);
        }
    );
});

router.get("/filterExamAccess", function (req, res, next) {
    var request = new sql.Request();
    var condition = url.parse(req.url).query;
    let parsedQs = querystring.parse(condition);

    request.query(
        "SELECT TOP (1) examId, examCode, studentRegNo, writtenStatus,subject_Code, examDate, startsFrom, endTo, createdBy FROM EXAMFOR" +
        " LEFT JOIN SCHEDULES ON EXAMFOR.exam_Id = SCHEDULES.examId WHERE studentRegNo = '" + parsedQs.studentRegNo +
        "' AND writtenStatus=" + parsedQs.writtenStatus + " AND  examDate='" + parsedQs.examDate +
        "' AND endTo>='" + parsedQs.currentTime + "' ORDER BY startsFrom",
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
    const { examId, registrationNumbers, writtenStatus } = req.body;

    var values = registrationNumbers.map(registrationNumber => {
        return ("(" + examId + ",'" + registrationNumber + "'," + writtenStatus + ")")
    })
    request.query(
        "INSERT INTO ExamFor " +
        "(exam_Id, studentRegNo, writtenStatus)" +
        " VALUES " + values,
        function (err, data) {
            if (err) {
                return console.error(err);
            }
            res.send(data.rowsAffected);
        }
    );
});

router.post("/editWrittenStatus", function (req, res, next) {
    var request = new sql.Request();
    const { examId, regNo, writtenStatus } = req.body;
    request.query(
        "UPDATE ExamFor SET writtenStatus=" + writtenStatus + " WHERE exam_Id=" + examId + " AND studentRegNo='" + regNo + "'",
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
    const { examId, registrationNumbers } = req.body;
    var values = "('" + registrationNumbers.join("','") + "')";
    request
        .query("DELETE FROM ExamFor WHERE exam_Id=" + examId + " AND studentRegNo IN " + values, function (
            err,
            data,
        ) {
            if (err) {
                return console.error(err);
            }
            res.send(data.recordset);
        });

})

module.exports = router;
