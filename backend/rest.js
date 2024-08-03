
const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const DiaryEntryModel = require('./entry-schema');
const { default: mongoose } = require('mongoose');
const { default: mongoose1 } = require('mongoose');
const UserModel = require('./user-model')
const bcrypt = require('bcrypt');
const userModel = require('./user-model');
const jwt = require('jsonwebtoken');


mongoose.connect('mongodb+srv://idk:idk@elevate.k86vszw.mongodb.net/?appName=Elevate')
.then(() => {
    console.log('connected to users database');
})
.catch(() => {
    console.log('error for users database');
})

// mongoose1.connect('mongodb+srv://aa:aa@resumes.24zhoub.mongodb.net/?retryWrites=true&w=majority&appName=resumes')
// .then(() => {
//     console.log('connected to resumes database');
// })
// .catch(() => {
//     console.log('error for resumes database');
// })





app.use(cors());

diaryEntries = [
    {id: 1, date: "march1 ", entry: "entry 1"},
    {id: 1, date: "marchda1 ", entry: "entry da1"},
    {id: 1, date: "march1sd ", entry: "entry asd1"},
];



app.use(bodyParser.json());

app.post('/add-entry', (req,res) => {
    diaryEntries.push({id: req.body.id, date: req.body.date, ebtry: req.body.entry});
    res.status(200).json( {
        message: "post submited"
    })


})



app.use((req,res,next) => {
    res.setHeader('Acess-control-orgin','*');
    res.setHeader('Acess-control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Acess-control-Allow-Methods','GET, POST, PUT, DELETE, OPTIONS');
    next();
})

app.get('/diary-entries',(req,res,next) => {
    res.json({'diaryEntries': diaryEntries});
    
})



// this

app.post('/sign-up', (req,res) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const userModel = new UserModel({
                username: req.body.username,
                password: hash
            })

            userModel.save()
            .then(result => {
                res.status(201).json({
                    message: 'User created',
                    result: result
                })
            })
            .catch(err => {
                res.status(500).json({
                    error: err
                })
            })
        })
})


app.post('/login', (req,res) => {

    let userFound;

    
    UserModel.findOne({username: req.body.username})
        .then(user => {
            if(!user){
                return res.status(401).json({
                    message: 'User not found'
                })
            }
            userFound = user
            return bcrypt.compare(req.body.password, user.password)
        })
    .then(result => {
        if(!result){
            return res.status(401).json({
                message: 'Password is incorrect'
            })
        }

        const token = jwt.sign({username: userFound.username, userId: userFound._id}, "secret_string", {expiresIn:"1h"})
        return res.status(200).json({
            token: token,
            expiresIn: 3600
        })
    })
    .catch(err => {
        return res.status(401).json({
            message: 'Error with authentication'
        })
    })
})


module.exports = app;