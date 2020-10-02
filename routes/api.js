const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()

const User = require('../models/user')
const ExamCluster = require('../models/exam-cluster')
const ExamLocation = require('../models/exam-location')
const Faculty = require('../models/faculty')
const Major = require('../models/major')
const TestScore = require('../models/test-score')

const mongoose = require('mongoose')
const faculty = require('../models/faculty')

mongoose.connect('mongodb+srv://nguyenoanh:nxE7Gs0E8dsZu2XU@cluster0.5asx0.mongodb.net/StuManage?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true}, function(err){
    if(err){
        console.log("Error " +err)
    }else{
        console.log("Connect database successful")
    }
})

module.exports = router

function verifyToken(req, res, next) {
    if (!req.headers.authorization){
        return res.status(404).send('Unauthorized request')
    }
    let token = req.headers.authorization.split(' ')[1]
    if (token === 'null'){
        return res.status(401).send('Unauthorized request')
    }
    let payload = jwt.verify(token, 'secretKey')
    if(!payload){
        return res.status(401).send('Unauthorized request')
    }
    req.userId = payload.subject
    next()
}

router.get('/', (req, res) => {
    res.send('From API route')
})

router.post('/register', (req, res) => {
    let userData = req.body
    let user = new User(userData)
    user.save((error, registeredUser) => {
        if(error){
            console.log(error)
        }else {
            let payload = { subject: registeredUser._id}
            let token = jwt.sign(payload, 'sevretKey')

            res.status(200).send({token})
        }
    })
})

router.post('/login', (req, res) =>{
    let userData = req.body

    User.findOne({email: userData.email}, (error, user) =>{
        if(error){
            console.log(error)
        }else{
            if(!user){
                res.status(401).send('Invalid email')
            }else{
                if(user.password !== userData.password){
                    res.status(401).send('Invalid password')
                }else{
                    let payload = { subject: user._id}
                    let token = jwt.sign(payload, 'secretKey')
                    res.status(200).send({token})
                }
            }
        }
    })
})

//Faculty
router.get('/faculty', (req, res) => {
    Faculty.find({
        FacultyName: req.facultyName
    }).then((faculty) => {
        res.json(faculty);
    }).catch((e) => {
        res.send(e);
    });
})

router.post('/faculty', (req, res) => {
    let facultyData = req.body
    let faculty = new Faculty(facultyData)

    //save in database
    faculty
    .save(faculty)
    .then(data => {
        res.send(data)
    }).catch(err => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while creating the Tutorial."
        })
    })
})

router.patch('/faculty/:id', (req, res) => { //update
    if (!req.body) {
        return res.status(400).send({
          message: "Data to update can not be empty!"
        });
      }
    
      const id = req.params._id;
    
      Tutorial.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
          if (!data) {
            res.status(404).send({
              message: `Cannot update Tutorial with id=${id}. Maybe Tutorial was not found!`
            });
          } else res.send({ message: "Tutorial was updated successfully." });
        })
        .catch(err => {
          res.status(500).send({
            message: "Error updating Tutorial with id=" + id
          });
        });
})

router.delete('/faculty/:id', (req, res) => {

})

// Majors
router.get('/major', (req, res) => {
    Major.find({
        majorName: req.majorName
    }).then((major) => {
        res.json(major);
    }).catch((e) => {
        res.send(e);
    });
})

router.post('/major', (req, res) => {
    let majorData = req.body
    let major = new Major(majorData)

    //save in database
    major
    .save(major)
    .then(data => {
        res.send(data)
    }).catch(err => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while creating the Tutorial."
        })
    })
})

router.patch('/major', (req, res) => {

})

router.delete('/major', (req, res) => {

})

//Exam cluster


//Exam location


//Test score