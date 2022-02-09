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
        "SELECT * FROM RESULTS WHERE " + commonFn.where(parsedQs),
        function (err, data) {
            if (err) {
                return console.error(err);
            }
            res.send(data.recordset);
        }
    );
});

router.get("/:examId", function (req, res, next) {
    var request = new sql.Request();

    request.query(
        "SELECT Results.student_RegNo, Students.name, Courses.groupName, SUM(ExamQuestions.mark) As maximumMarks," +
        "COUNT(ExamQuestions.question) AS noOfQuestions, " +
        "SUM( case when Results.writtenAnswer = ExamQuestions.correctAnswer then ExamQuestions.mark else 0 end) AS positiveMarks, " +
        "SUM( case when Results.writtenAnswer = ExamQuestions.correctAnswer then 0 else ExamQuestions.negativeMark end) AS negativeMarks, " +
        "SUM( case when Results.writtenAnswer = ExamQuestions.correctAnswer then ExamQuestions.mark else - ExamQuestions.negativeMark end) AS marksReceived " +
        "FROM Results " +
        "LEFT JOIN Schedules ON Results.exam_Id = Schedules.examId " +
        "LEFT JOIN ExamQuestions ON Results.exam_Id = ExamQuestions.exam_Id " +
        "AND Results.question_No = ExamQuestions.questionNo " +
        "LEFT JOIN  Students ON Results.student_RegNo = Students.registrationNo " +
        "LEFT JOIN  Courses ON Students.course_Code = Courses.courseCode " +
        "WHERE Results.exam_Id = " + req.params.examId + " " +
        "GROUP BY Results.student_RegNo, Students.name, Courses.groupName",
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
    var items = req.body.data;
    console.log(items);
    var values = items.map(item => {
        return ("(" + item.examId + ",'" + item.regNo + "'," + item.questionNo + ",'" + item.ans + "')")
    })
    var query = "INSERT INTO RESULTS (exam_Id, student_RegNo, question_No, writtenAnswer) VALUES " + values

    request.query(query,
        function (err, data) {
            if (err) {
                return console.error(err);
            }
            res.send(data.rowsAffected);
        }
    );
});


module.exports = router;
