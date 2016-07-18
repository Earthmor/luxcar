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

    req.Validator.getErrors(function(errors) {
        if(errors.length > 0) {
            res.render('offer', {title: 'ELEPHANT|Эвакуатор|Ремонт', route: req.url, errors: errors});
        } else {
            console.log('all done');
            res.mailer.send('mail/offer_email.ejs', {
                to: 'artiom.budnikoff@yandex.ru',
                subject: 'Test Email',
                otherProperty: 'Other Property'
            }, function (err) {
                if (err) {
                    console.log(err);
                    res.send('There was an error sending the email');
                    return;
                }
                //todo need handel
                res.send('Email Sent');
            });
            console.log('email sended');
            res.render('offer', {title: 'ELEPHANT|Эвакуатор|Ремонт', route: req.url});
        }
    });
});

module.exports = router;
