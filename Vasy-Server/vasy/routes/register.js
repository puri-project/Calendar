const express = require('express');
var router = express.Router();
router.get('/', (req, res) => {
    req.flash("name", "1111");
    res.render('register');
});
module.exports = router;