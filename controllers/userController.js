const { body, validationResult } = require('express-validator');
var jwt = require('jsonwebtoken')
// const users = require('../models/users');
var User = require('../models/user')
var bcrypt = require('bcrypt');
const user = require('../models/user');

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
            req.body
        )

        const userDataValidate = {
            email : user.email,
            password : user.password
        }



        if(!errors.isEmpty()){
            res.render('sign_up_form', { title: 'Sign Up', user: req.body, errors: errors.array() });
            return;
        } else {
            await user.save() 
            const accessToken = await jwt.sign({userDataValidate}, process.env.JWT_KEY)
            res.cookie('token', accessToken)
            
            res.render('profile_form', {title: 'Users', user: user})
        }

    }
];

exports.sign_in_get = function (req, res, next) {

    //render
    res.render('sign_in_form', { title: 'Sign In'});
}

exports.sign_in_post = [
    
    async (req, res, next) => {
        const userData = {
            email: req.body.email,
            password: req.body.password,
        }

        // login acc
        const user = await User.findOne({email: req.body.email})
        // console.log(req.body.password);
        // console.log(user);
        if(!user) return res.status(422).send('Email or PW không đúng')
        const isPassword = await bcrypt.compare(req.body.password, user.password)
        console.log(isPassword);
        if(!isPassword) return res.status(422).send('Email or Pw không đúng')

        const accessToken = await jwt.sign({userData}, process.env.JWT_KEY)
        console.log(accessToken);
        res.cookie('token', accessToken)

        res.render('profile_form', {title: 'Users', user: user})

    }
]

exports.user_update_get = function (req, res, next) {
    User.find({_id: req.params.id}).then((user)=>{
        console.log(user)
        res.render('user_form', { title: 'Update Introduce', user : user});
    })
   
}

exports.user_update_post = async function(req,res,next){
   
    let tempUser ={};
    await User.find({_id:req.params.id}).then((user)=>{
        user[0].introduce=req.body.introduce;
        tempUser = user[0]; 
        //console.log(user[0]);
    }).catch(next);

    await User.updateOne({_id:req.params.id},tempUser).then(()=>{
        console.log(user);
        res.render('profile_form', {title: 'Users', user : tempUser})   
    }).catch(next);

    
}
