var express = require('express');
var router = express.Router();

/* GET services page. */
router.get('/portfolio', function(req, res, next) {
    res.render('portfolio', { title: 'ELEPHANT|Эвакуатор|Ремонт', route: req.url });
});

/* GET services page. */
router.get('/portfolio/kirovsk', function(req, res, next) {
    res.render('work/kirovsk', { title: 'ELEPHANT|Эвакуатор|Ремонт', route: req.url });
});

module.exports = router;
