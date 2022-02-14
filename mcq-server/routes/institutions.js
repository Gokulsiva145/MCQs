var express = require("express");
var sql = require("mssql");
var router = express.Router();
var url = require("url");
var querystring = require("querystring");
var commonFn = require("./common");

router.get("/all", function (req, res, next) {
    var request = new sql.Request();
    request.query("SELECT * FROM INSTITUTIONS", function (err, data) {
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
        "SELECT * FROM INSTITUTIONS WHERE " + commonFn.where(parsedQs),
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
    const { institutionName } = req.body;
    request.query(
        "INSERT INTO INSTITUTIONS (institutionId, institutionName) VALUES((SELECT ISNULL(MAX(institutionId), 0) + 1 FROM INSTITUTIONS),'" + institutionName + "')",
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
    const { institutionId, institutionName } = req.body;
    request.query(
        "UPDATE INSTITUTIONS SET institutionName='" + institutionName + "' WHERE institutionId=" + institutionId ,
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
    var values =courseCodes.join(",");
    request
        .query("DELETE FROM INSTITUTIONS WHERE institutionId IN (" + values +")", function (
            err,
            data,
        ) {
            if (err) {
                return console.error(err);
            }
            res.send(data.recordset);
        });

})

router.delete('/:institutionId', function (req, res, next) {
    var request = new sql.Request();
    request.query("DELETE FROM INSTITUTIONS WHERE institutionId='" + req.params.institutionId + "'",
        function (err, data) {
            if (err) {
                return console.error(err);
            }
            res.send(data.rowsAffected);
        }
    );
})

module.exports = router;
