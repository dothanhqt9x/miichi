const { body, validationResult } = require('express-validator');
// const users = require('../models/users');
var User = require('../models/user')

exports.sign_up_get = function (req, res, next) {
    res.render('sign_up_form', { title: 'Sign Up'});
}

exports.sign_up_post = [
    body('email').trim().isLength({ min: 1 }).escape().isEmail().withMessage('ban da dien vao khong phai dinh dang cua email').exists().withMessage("tai khoan email này đã tồn tại"),
    body('name').trim().isLength({ min: 1 }).escape().isAlphanumeric().withMessage('Name cua ban khong phai la 1 so hay ky tu'),
    body('gender').escape(),
    body('password').trim().isLength({ min: 5 }).withMessage('ban chua du 5 ký tự '),
    body('introduce').trim().isLength({ min: 1}),

    async (req, res, next) => {
        const errors = validationResult(req);

        var user = new User(
            {
                email: req.body.email,
                name: req.body.name,
                gender: req.body.gender,
                password: req.body.password,
                introduce: req.body.introduce
            });
    
        if(!errors.isEmpty()){
            res.render('sign_up_form', { title: 'Sign Up', user: req.body, errors: errors.array() });
            return;
        } else {
            await user.save()
            const token = await user.generateAuthToken()
            res.redirect('/');
            // user.save(function (err) {

                
            //     if (err) { return next(err); }
            //     const token = user.generateAuthToken()  // update xoa await
            //     res.status(201).render('index', { title: 'Đăng nhập thành công', data: data })
            //     // Successful - redirect to new author record.
            //     res.redirect('/'); // need redirect to home page
            // });
        }

    }
];

exports.sign_in_get = function (req, res, next) {
    //render
    res.render('sign_in_form', { title: 'Sign In'});
}

exports.sign_in_post = [
    // (req, res, next) => {
    //     Users.findOne({ email: req.body.email }).then(
    //         (users) => {
    //             if(!users) {
    //                 res.render('sign_in_form', { title: 'Sign In user not found'});
    //             }
    //             if (req.body.password === users.password) {
    //                 res.redirect('/');
    //             } else {
    //                 res.render('sign_in_form', { title: 'Sign pw or user error'});
    //             }
    //         }
    //     );
        
    // }
    async(req, res) => {
        //Login a registered user
        try {
            const { email, password } = req.body
            const user = await User.findByCredentials(email, password)
            if (!user) {
                return res.status(401).send({error: 'Login failed! Check authentication credentials'})
            }
            const token = await user.generateAuthToken()
            res.render('sign_in_form',{ title: 'Đăng nhập thành công' })
        } catch (error) {
            res.status(400).send(error)
        }
    }
]

exports.profiles = function (req, res) {
    // render
}