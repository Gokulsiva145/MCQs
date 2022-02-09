var express = require("express");
var sql = require("mssql");
var router = express.Router();
var url = require("url");
var querystring = require("querystring");
var commonFn = require("./common");

router.get("/all", function (req, res, next) {
    var request = new sql.Request();
    request.query("SELECT * FROM COURSETYPES ORDER BY COURSETYPEID", function (err, data) {
        if (err) {
            return console.error(err);
        }
        res.send(data.recordset);
    });
});

module.exports = router;
