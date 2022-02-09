var express = require("express");
var sql = require("mssql");
var router = express.Router();
var url = require("url");
var querystring = require("querystring");
var commonFn = require("./common");

//router.get("/all", function (req, res, next) {
//    var request = new sql.Request();
//    request.query("SELECT * FROM SCHEDULES ORDER BY EXAMID", function (err, data) {
//        if (err) {
//            return console.error(err);
//        }
//        res.send(data.recordset);
//    });
//});


//router.get("/questions/filtered", function (req, res, next) {
//    var request = new sql.Request();
//    var condition = url.parse(req.url).query;
//    let parsedQs = querystring.parse(condition);

//    request.query(
//        "SELECT * FROM ExamQuestions WHERE " + commonFn.where(parsedQs) + " ORDER BY questionNo",
//        function (err, data) {
//            if (err) {
//                return console.error(err);
//            }
//            res.send(data.recordset);
//        }
//    );
//});

router.get("/types", function (req, res, next) {
    var request = new sql.Request();

    request.query(
        "SELECT * FROM QuestionTypes ORDER BY questionType",
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
        "SELECT * FROM ExamQuestions WHERE exam_Id='" + req.params.examId + "' ORDER BY questionNo",
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
    const { examId, questionNo, question, optionA, optionB, optionC, optionD, answer, mark, negativeMark, questionType } = req.body;
    request.query(
        "INSERT INTO ExamQuestions " +
        "(Id, exam_Id, questionNo, question, optionA, optionB, optionC, optionD, correctAnswer, mark, negativeMark, question_Type_Id)" +
        " VALUES((SELECT ISNULL(MAX(Id), 0) + 1 FROM ExamQuestions)," +
        examId + "," + questionNo + ",'" + question + "','" + optionA + "','" + optionB + "','" + optionC +
        "','" + optionD + "','" + answer + "'," + mark + "," + negativeMark + "," + questionType + ")",
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
    const { examId, questionNo, question, optionA, optionB, optionC, optionD, answer, mark, negativeMark, questionType, oldQuestionNo } = req.body;

    request.query(
        "UPDATE ExamQuestions SET" +
        " questionNo=" + questionNo +
        " , question='" + question +
        "', optionA='" + optionA +
        "', optionB='" + optionB +
        "', optionC='" + optionC +
        "', optionD='" + optionD +
        "', correctAnswer='" + answer +
        "', mark=" + mark +
        ", negativeMark=" + negativeMark +
        " , question_Type_Id=" + questionType +
        " WHERE exam_Id=" + examId + " AND  questionNo=" + oldQuestionNo,
        function (err, data) {
            if (err) {
                return console.error(err);
            }
            res.send(data.rowsAffected);
        }
    );
});

router.delete('/:questionId', function (req, res, next) {
    var request = new sql.Request();
    request
        .query('DELETE FROM ExamQuestions WHERE Id=' + req.params.questionId, function (
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
