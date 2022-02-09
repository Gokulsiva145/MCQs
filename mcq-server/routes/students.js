var express = require("express");
var sql = require("mssql");
var router = express.Router();
var url = require("url");

var multer = require('multer');
var fs = require('fs');

var querystring = require("querystring");
var commonFn = require("./common");

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/students')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

var upload = multer({ storage: storage }).single('file');
//var upload = multer({ storage: storage }).array('file')

router.get("/all", function (req, res, next) {
    var request = new sql.Request();
    request.query("SELECT registrationNo,name, birthDate, email, courseCode, groupName, institution, avatarUrl, statusCode, status FROM STUDENTS " +
        "LEFT JOIN COURSES ON course_Code = courseCode " +
        "LEFT JOIN STATUS ON status_Code = statusCode ", function (err, data) {
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
        "SELECT * FROM STUDENTS WHERE " + commonFn.where(parsedQs),
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
    const { regNo, name, dob, email, course, institution, avatarUrl, statusCode } = req.body;
    request.query(
        "INSERT INTO STUDENTS " +
        "(registrationNo, name, birthDate, email, course_Code, institution, avatarUrl, status_Code)" +
        " VALUES('" +
        regNo +
        "','" +
        name +
        "','" +
        dob +
        "','" +
        email +
        "','" +
        course +
        "','" +
        institution +
        "','" +
        avatarUrl +
        "'," +
        statusCode +
        ")",
        function (err, data) {
            if (err) {
                res.send(err);
                if (err.originalError.info.number == 2627) {
                    return console.log("Duplicate Registration Address");
                }
                return console.error(err);
            }
            res.send(data.rowsAffected);
        }
    );
});

router.post("/edit", function (req, res, next) {
    var request = new sql.Request();
    const { regNo, name, dob, email, course, institution, avatarUrl, statusCode } = req.body;
    request.query(
        "UPDATE STUDENTS SET" +
        " name='" +
        name +
        "', birthDate='" +
        dob +
        "', email='" +
        email +
        "', course_Code='" +
        course +
        "', institution='" +
        institution +
        "', avatarUrl='" +
        avatarUrl +
        "', status_Code=" +
        statusCode +
        " WHERE registrationNo='" + regNo + "'",
        function (err, data) {
            if (err) {
                return console.error(err);
            }
            res.send(data.rowsAffected);
        }
    );
});

router.post('/uploadFiles', function (req, res) {

    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err)
        } else if (err) {
            return res.status(500).json(err)
        }

        var data = {
            file: req.files,
        }
        data = JSON.stringify(data);
        return res.status(200).send(data);
    })

});


router.delete('/remove', function (req, res, next) {
    var request = new sql.Request();
    const {  regNos } = req.body;
    var values = "('" + regNos.join("','") + "')";
    request
        .query("DELETE FROM STUDENTS WHERE registrationNo IN " + values , function (
            err,
            data,
        ) {
            if (err) {
                return console.error(err);
            }
            res.send(data.recordset);
        });

})

router.delete("/:registrationNo", function (req, res, next) {
    var request = new sql.Request();
    request.query(
        "DELETE FROM STUDENTS WHERE registrationNo='" + req.params.registrationNo + "'",
        function (err, data) {
            if (err) {
                return console.error(err);
            }
            res.send(data.rowsAffected);
        }
    );
});
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

module.exports = router;
