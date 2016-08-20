var express = require('express');
var router = express.Router();

/* GET offer page. */
router.get('/offer', function (req, res, next) {
    res.render('offer', {title: 'ELEPHANT|Эвакуатор|Ремонт', route: req.url, state: {}});
});

router.post('/offer', function (req, res, next) {
    req.Validator
        .validate('mark', req.__('mark.displayName'), {
            required: true,
            length: {
                min: 4,
                max: 64
            }
        }).filter('mark', {
            stripTags: false,
            escapeHTML: false
        })
        .validate('weight', req.__('weight.displayName'), {
            required: true,
            length: {
                min: 4,
                max: 20
            }
        }).filter('weight', {
            stripTags: false,
            escapeHTML: false
        })
        .validate('from', req.__('from.displayName'), {
            required: true,
            length: {
                min: 4,
                max: 64
            }
        }).filter('from', {
            stripTags: false,
            escapeHTML: false
        })
        .validate('to', req.__('to.displayName'), {
            required: true,
            length: {
                min: 4,
                max: 64
            }
        }).filter('to', {
            stripTags: false,
            escapeHTML: false
        })
        .validate('dateCarriage', req.__('dateCarriage.displayName'), {
            required: true,
            length: {
                min: 16,
                max: 19
            }
        }).filter('dateCarriage', {
            stripTags: false,
            escapeHTML: false
        })
        .validate('fio', req.__('fio.displayName'), {
            required: true,
            length: {
                min: 4,
                max: 64
            }
        }).filter('fio', {
            stripTags: false,
            escapeHTML: false
        })
        .validate('phone', req.__('phone.displayName'), {
            required: true,
            length: {
                min: 10,
                max: 20
            }
        }).filter('phone', {
            stripTags: false,
            escapeHTML: false
        })
        .validate('email', req.__('email.displayName'), {
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
        .validate('optionsPriority', req.__('optionsPriority.displayName'), {
            required: false
        }).filter('optionsPriority', {
            stripTags: false,
            escapeHTML: false
        })
        .validate('comment', req.__('comment.displayName'), {
            required: false,
            length: {
                min: 0,
                max: 4000
            }
        }).filter('comment', {
            stripTags: false,
            escapeHTML: false
        });

    req.Validator.getErrors(function (errors) {
        if (errors.length > 0) {
            res.render('offer', {
                title: 'ELEPHANT|Эвакуатор|Ремонт',
                route: req.url,
                errors: errors,
                state: {}
            });
        } else {
            res.mailer.send('mail/offer_email.ejs', {
                to: 'artiom.budnikoff@yandex.ru',
                subject: 'Заявка на эвакуацию [' + req.Validator.getValue('fio') + ']',
                mark: req.Validator.getValue('mark'),
                weight: req.Validator.getValue('weight'),
                whereFrom: req.Validator.getValue('from'),
                whereTo: req.Validator.getValue('to'),
                dateCarriage: req.Validator.getValue('dateCarriage'),
                fio: req.Validator.getValue('fio'),
                phone: req.Validator.getValue('phone'),
                email: req.Validator.getValue('email'),
                optionsPriority: req.Validator.getValue('optionsPriority'),
                comment: req.Validator.getValue('comment')
            }, function (err) {
                if (err) {
                    console.log(err);
                    res.render('offer', {
                        title: 'ELEPHANT|Эвакуатор|Ремонт',
                        route: req.url,
                        state: {
                            error: err
                        }
                    });
                } else {
                    res.render('offer', {
                        title: 'ELEPHANT|Эвакуатор|Ремонт',
                        route: req.url,
                        state: {
                            success: req.Messages.get('offer.send.success')
                        }
                    });
                }
            });
        }
    });
});

module.exports = router;
