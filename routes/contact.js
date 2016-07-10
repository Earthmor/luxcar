var express = require('express');
var router = express.Router();

/* GET services page. */
router.get('/contact', function(req, res, next) {
    res.render('contact', { title: 'ELEPHANT|Эвакуатор|Ремонт', route: req.url });
});

module.exports = router;
