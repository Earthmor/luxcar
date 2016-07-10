var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/offer', function(req, res, next) {
    res.render('offer', { title: 'ELEPHANT|Эвакуатор|Ремонт', route: req.url});
});

router.post('/offer', function(req, res, next) {
    req.Validator
        .validate('mark', {
            required: true,
            length: {
                min: 4,
                max: 64
            }
        }).filter('mark', {
            stripTags: false,
            escapeHTML: false
        })
        .validate('weight', {
            required: true,
            length: {
                min: 4,
                max: 20
            }
        }).filter('weight', {
            stripTags: false,
            escapeHTML: false
        })
        .validate('from', {
            required: true,
            length: {
                min: 4,
                max: 64
            }
        }).filter('from', {
            stripTags: false,
            escapeHTML: false
        })
        .validate('to', {
            required: true,
            length: {
                min: 4,
                max: 64
            }
        }).filter('to', {
            stripTags: false,
            escapeHTML: false
        })
        .validate('dateCarriage', {
            required: true,
            length: {
                min: 16,
                max: 19
            }
        }).filter('dateCarriage', {
            stripTags: false,
            escapeHTML: false
        })
        .validate('fio', {
            required: true,
            length: {
                min: 4,
                max: 64
            }
        }).filter('fio', {
            stripTags: false,
            escapeHTML: false
        })
        .validate('phone', {
            required: true,
            length: {
                min: 10,
                max: 20
            }
        }).filter('phone', {
            stripTags: false,
            escapeHTML: false
        })
        .validate('email', {
            required: false,
            length: {
                min: 0,
                max: 64
            },
            email: true
        }).filter('email', {
            stripTags: false,
            escapeHTML: false
        })
        .validate('optionsPriority', {
            required: false
        }).filter('optionsPriority', {
            stripTags: false,
            escapeHTML: false
        })
        .validate('comment', {
            required: false,
            length: {
                min: 0,
                max: 4000
            }
        }).filter('comment', {
            stripTags: false,
            escapeHTML: false
        });

    req.Validator.getErrors(function(errors){
        console.log(errors);
        console.log(req.url);
        res.render('offer', { title: 'ELEPHANT|Эвакуатор|Ремонт', route: req.url, errors: errors});
    });
});

module.exports = router;
