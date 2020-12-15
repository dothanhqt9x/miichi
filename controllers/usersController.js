const { body, validationResult } = require('express-validator')
var Users = require('../models/users')

exports.sign_up_get = function (req, res, next) {
    res.render('sign_up_form', { title: 'Sign Up'});
}

exports.sign_up_post = [
    body('email').trim().isLength({ min: 1 }).escape().isEmail().withMessage('ban da dien vao khong phai dinh dang cua email'),
    body('name').trim().isLength({ min: 1 }).escape().isAlphanumeric().withMessage('Name cua ban khong phai la 1 so hay ky tu'),
    body('gender').escape(),
    body('password').trim().isLength({ min: 5 }),
    body('introduce').trim().isLength({ min: 1}),

    (req, res, next) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            res.render('sign_up_form', { title: 'Sign Up', users: req.body, errors: errors.array() });
            return;
        } else {
            var users = new Users(
                {
                    email: req.body.email,
                    name: req.body.name,
                    gender: req.body.gender,
                    password: req.body.password,
                    introduce: req.body.introduce
                });
            users.save(function (err) {
                if (err) { return next(err); }
                // Successful - redirect to new author record.
                res.redirect(authr.url); // need redirect to home page
            });
        }

    }
];

exports.sign_in = function (req, res) {
    //render
}

exports.profiles = function (req, res) {
    // render
}