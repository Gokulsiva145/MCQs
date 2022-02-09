var express = require("express");
var sql = require("mssql");
var router = express.Router();
var url = require("url");
var querystring = require("querystring");
var commonFn = require("./common");

router.get("/all", function (req, res, next) {
    var request = new sql.Request();
    request.query("SELECT * FROM SCHEDULES ORDER BY EXAMID", function (err, data) {
        if (err) {
            return console.error(err);
        }
        res.send(data.recordset);
    });
});

router.get("/filter", function (req, res, next) {
    var request = new sql.Request();
    var condition = url.parse(req.url).query;
    let parsedQs = querystring.parse(condition);

    request.query(
        "SELECT examId, examCode, subjectCode, subjectName, examDate, startsFrom, endTo, passMark, examType FROM SCHEDULES " +
        "LEFT JOIN SUBJECTS ON SCHEDULES.subject_Code = SUBJECTS.subjectCode WHERE " + commonFn.where(parsedQs),
        function (err, data) {
            if (err) {
                return console.error(err);
            }
            res.send(data.recordset);
        }
    );
});

//router.get("/getExamsInfo", function (req, res, next) {
//    var request = new sql.Request();
//    var condition = url.parse(req.url).query;
//    let parsedQs = querystring.parse(condition);

//    request.query(
//        "SELECT examId, examCode, subjectCode, subjectName, examDate, startsFrom, endTo, conductBy, courseCode, groupName, course, course_Type_Id " +
//        "FROM Schedules " +
//        "LEFT JOIN Courses ON Schedules.course_Code = Courses.courseCode " +
//        "LEFT JOIN Subjects ON Schedules.subject_Code = Subjects.subjectCode " +
//        "WHERE " + commonFn.where(parsedQs) +
//        "ORDER BY " +
//        "examId",
//        function (err, data) {
//            if (err) {
//                return console.error(err);
//            }
//            res.send(data.recordset);
//        }
//    );
//});

router.get("/:loggedUser", function (req, res, next) {
    var request = new sql.Request();
    request.query(
        "SELECT examId, examCode, subjectCode, subjectName, examDate, startsFrom, endTo, passMark, examType FROM SCHEDULES " +
        "LEFT JOIN SUBJECTS ON SCHEDULES.subject_Code = SUBJECTS.subjectCode " +
        "WHERE createdBy = '" + req.params.loggedUser + "' ORDER BY examId",
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
    const { examCode, subjectCode, examDate, startsFrom, endTo, passMark, examType, createdBy } = req.body;
    request.query(
        "INSERT INTO SCHEDULES " +
        "(examId, examCode, subject_Code, examDate, startsFrom, endTo, passMark, examType, createdBy)" +
        " VALUES((SELECT ISNULL(MAX(examId), 0) + 1 FROM SCHEDULES),'" +
        examCode + "','" + subjectCode + "','" + examDate + "','" +
        startsFrom + "','" + endTo + "'," + passMark + "," + examType + ",'" + createdBy + "')",
        function (err, data) {
            if (err) {
                return console.error(err);
            }
            res.send(data.rowsAffected);
        }
    );
});

router.post("/edit", function (req, res, next) {
    var request = new sql.Request();
    const { examId, examCode, subjectCode, examDate, startsFrom, endTo, passMark, examType } = req.body;
    request.query(
        "UPDATE SCHEDULES SET examCode='" + examCode + "', subject_Code='" + subjectCode + "', examDate='" +
        examDate + "', startsFrom='" + startsFrom + "', endTo='" + endTo + "',passMark=" + passMark + ", examType=" +
        examType + " WHERE examId=" + examId,
        function (err, data) {
            if (err) {
                return console.error(err);
            }
            res.send(data.rowsAffected)
        }
    );
});

router.delete('/remove', function (req, res, next) {
    var request = new sql.Request();
    const {  examIds } = req.body;
    var values = examIds.join(",");

    var sqlQuery = "DELETE FROM EXAMQUESTIONS WHERE exam_Id IN (" + values + ");" +
        "DELETE FROM EXAMFOR WHERE exam_Id IN (" + values + ");" +
        "DELETE FROM RESULTS WHERE exam_Id IN (" + values + ");" +
        "DELETE FROM SCHEDULES WHERE examId IN (" + values + ");"
    request
        .query(sqlQuery, 
        function (
            err,
            data,
        ) {
            if (err) {
                return console.error(err);
            }
            res.send(data.recordset);
        });

})

router.delete('/:examId', function (req, res, next) {
    var request = new sql.Request();
    var examId = req.params.examId;
    var sqlQuery = "DELETE FROM EXAMQUESTIONS WHERE exam_Id=" + examId + ";" +
        "DELETE FROM EXAMFOR WHERE exam_Id =" + examId + ";" +
        "DELETE FROM RESULTS WHERE exam_Id =" + examId + ";" +
        "DELETE FROM SCHEDULES WHERE examId = " + examId + ";"
    request.query(sqlQuery,
        function (err, data) {
            if (err) {
                return console.error(err);
            }
            res.send(data.rowsAffected);        
        }
    );
})

module.exports = router;
