var express = require("express");
var sql = require("mssql");
var router = express.Router();
var url = require("url");
var querystring = require("querystring");
var commonFn = require("./common");

router.get("/all", function (req, res, next) {
    var request = new sql.Request();
    request.query("SELECT userId, firstName, lastName, email, passCode, user_Type_Id, userType, status_Code, status FROM USERS "+
        "LEFT JOIN STATUS ON status_Code = statusCode LEFT JOIN USERTYPES ON user_Type_Id = userTypeId", function (err, data) {
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
        "SELECT * FROM USERS WHERE " + commonFn.where(parsedQs),
        function (err, data) {
            if (err) {
                return console.error(err);
            }
            res.send(data.recordset);
        }
    );
});

router.post("/userAuthentication", function (req, res, next) {
    var request = new sql.Request();
    request.query(
        "SELECT userId, firstName, lastName, email, user_Type_Id, userType, status_Code FROM USERS " +
        "LEFT JOIN USERTYPES ON user_Type_Id = userTypeId WHERE email='" +
        req.body.email +
        "' AND passCode='" +
        req.body.password +
        "' COLLATE SQL_Latin1_General_CP1_CS_AS",
        function (err, data) {
            if (err) {
                return console.error(err);
            }
            res.send(data.recordset);
        }
    );
});

router.post("/verifyUserStatus/:email", function (req, res, next) {
    var request = new sql.Request();
    request.query(
        "SELECT * FROM USERS WHERE email='" + req.params.email + "'",
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
    const { firstName, lastName, email, password, userType, statusCode } = req.body;
    request.query(
        "INSERT INTO USERS " +
        "(userId, firstName, lastName, email, passCode,user_Type_Id,status_Code)" +
        " VALUES((SELECT ISNULL(MAX(userId), 0) + 1 FROM USERS), '" +
        firstName +
        "','" +
        lastName +
        "','" +
        email +
        "','" +
        password +
        "'," +
        userType +
        "," +
        statusCode +
        ")",
        function (err, data) {
            if (err) {
                res.send(err);
                if (err.originalError.info.number == 2627) {
                    return console.log("Duplicate Email Address");
                }
                return console.error(err);
            }
            res.send(data.rowsAffected);
        }
    );
});

router.post("/edit", function (req, res, next) {
    var request = new sql.Request();
    const { userId,firstName, lastName, email, password, userType, statusCode } = req.body;
    request.query(
        "UPDATE USERS " +
        "SET firstName='" + firstName + "', lastName='" + lastName +
        "', email='" + email + "', passCode='" + password +
        "',user_Type_Id=" + userType + ",status_Code=" + statusCode + " WHERE userId=" + userId,
        function (err, data) {
            if (err) {
                res.send(err);
                if (err.originalError.info.number == 2627) {
                    return console.log("Duplicate Email Address");
                }
                return console.error(err);
            }
            res.send(data.rowsAffected);
        }
    );
});

router.delete('/remove', function (req, res, next) {
    var request = new sql.Request();
    const {  userIds } = req.body;
    var values = userIds.join(",");
    request
        .query("DELETE FROM USERS WHERE userId IN (" + values + ")", function (
            err,
            data,
        ) {
            if (err) {
                return console.error(err);
            }
            res.send(data.recordset);
        });

})

router.delete("/:userId", function (req, res, next) {
    var request = new sql.Request();
    request.query(
        "DELETE FROM USERS WHERE USERID=" + req.params.userId,
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
