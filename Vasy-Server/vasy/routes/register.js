const express = require('express');
const bcrypt = require('bcrypt');
const DB = require('../models');
var router = express.Router();

router.get('/', (req, res) => {
    console.log(req.body);
    res.json({"check" : true});
});

router.post('/', (req, res) => {
    // 중복 검사
    DB.isLocalUser(checkResult, req.body.email);

    function checkResult(err, result) {
        if(err || result == false) {
            console.log(err);
            return res.json({"check" : false});
        }
        // 회원가입
        DB.insertLocalUser(insertResult, req.body);
    }

    function insertResult(err, result){
        if(err) {
            console.log(err);
            return res.json({"check" : false});
        }
        return res.json({"check" : result});
    }
});

module.exports = router;