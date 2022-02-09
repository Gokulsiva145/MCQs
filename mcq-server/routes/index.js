var express = require('express');
var router = express.Router();
var sql = require('mssql');

var status;
const config = {
    user: "sa",
    password: "Admin123*",
    server: "localhost",
    database: "DB_MCQs",
    options: {
        encrypt: true,
        trustServerCertificate: true,
    },
};

sql.connect(config, (err, pool) => {
    if (err) {
        return console.error(err);
    }
    status = "DB connection established - starting web server";
    console.log(status);
});

/* GET home page. */
router.get('/', function (req, res, next) {   
    res.render('index', { title: 'Express', connectionStatus: status });
});

module.exports = router;
