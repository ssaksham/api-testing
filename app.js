var express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    User = require('./User'),
    bodyParser = require('body-parser'),
    port = process.env.PORT || 80,
    auth = require('./authorization'),
    bcrypt = require('bcrypt'),
    jwt = require('jsonwebtoken');
require('dotenv').config();
mongoose.connect(process.env.DATABASEURL, { useNewUrlParser: true, useUnifiedTopology: true });
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());





app.post('/user/signup', (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (err) {
            return res.status(400).send({
                "err": err.message
            });
        }
        bcrypt.hash(req.body.password, 10, function(err, hash) {

            var user = new User({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                DOB: req.body.DOB,
                password: hash,
                number: req.body.number
            });
            user.save().then((result) => {
                return res.status(201).send({
                    message: 'Signed Up Successfully'
                });
            }).catch((err) => {
                var msg = err.message;
                if (err.code == 11000)
                    msg = "Account with same Email already exists";
                return res.status(400).send({
                    error: msg
                });
            });
        });
    });
});


app.post('/user/login', (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (err || (user == undefined))
            return res.status(400).send({ "error": err });
        bcrypt.compare(req.body.password, user.password, function(err, result) {
            if (err) {
                return res.status(400).send({
                    "message": "Required Email and Password"
                });
            }
            if (result) {
                const token = jwt.sign({
                    email: user.email,
                    id: user._id
                }, process.env.JWTKEY, {
                    expiresIn: "120000"
                });
                return res.status(200).send({
                    "message": "Login Successful",
                    "Validity": "Next 120 seconds",
                    "token": token
                });
            }
            return res.status(400).send({
                "message": "Authentication Failed"
            });
        });
    });
});


app.get('/user/list', auth, (req, res) => {
    User.find({}, { "firstName": 1, "lastName": 1, "email": 1, "number": 1, "DOB": 1, "_id": 0 }, (err, result) => {
        return res.status(200).send({
            "result": result
        });
    });
});

app.all('*', (req, res) => {
    return res.status(501).send({
        message: "Not Implemented"
    });
})

app.listen(port, () => {
    console.log(`Listening at Port:${port}`)
})