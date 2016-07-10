var express = require('express');
var router = express.Router();

/* GET services page. */
router.get('/services', function(req, res, next) {
    res.render('services', { title: 'ELEPHANT|Эвакуатор|Ремонт', route: req.url });
});
router.get('/services/motorcycle', function(req, res, next) {
    res.render('services/motorcycle', { title: 'ELEPHANT|Эвакуатор|Ремонт', route: req.url });
});
router.get('/services/soberdriver', function(req, res, next) {
    res.render('services/soberdriver', { title: 'ELEPHANT|Эвакуатор|Ремонт', route: req.url });
});
router.get('/services/specialtechnics', function(req, res, next) {
    res.render('services/specialtechnics', { title: 'ELEPHANT|Эвакуатор|Ремонт', route: req.url });
});
module.exports = router;
