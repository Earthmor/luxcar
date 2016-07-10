var express = require('express');
var router = express.Router();

/* GET services page. */
router.get('/price', function(req, res, next) {
    res.render('price', { title: 'ELEPHANT|Эвакуатор|Ремонт', route: req.url });
});

module.exports = router;
