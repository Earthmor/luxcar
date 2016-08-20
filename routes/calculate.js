var express = require('express');
var router = express.Router();

/* GET services page. */
router.get('/calculate', function(req, res, next) {
    res.render('calculate', { title: 'ELEPHANT|Эвакуатор|Ремонт', route: req.url });
});

module.exports = router;
