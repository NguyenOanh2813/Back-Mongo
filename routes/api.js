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

router.put('/faculty/:id', (req, res) => { //update
    Faculty.findOneAndUpdate({ _id: req.params.id}, {
        $set: req.body
    }).then(() => {
        res.send({ 'message': 'updated successfully'});
    });
})

router.delete('/faculty/:id', (req, res) => {
    Faculty.findOneAndRemove({
        _id: req.params.id
    }).then((removedListDoc) => {
        res.send(removedListDoc);

        // delete all the tasks that are in the deleted list
        deleteTasksFromList(removedListDoc._id);
    })
})

// Majors in Faculty
router.get('/faculty/:facultyId/major', (req, res) => {
    Major.find({
        facultyID: req.params.facultyId
    }).then((major) => {
        res.json(major);
    }).catch((e) => {
        res.send(e);
    });
})

router.post('/faculty/:facultyId/major', (req, res) => {
    Faculty.findOne({
        _id: req.params.facultyId
    }).then((faculty) => {
        if (faculty) {
            return true;
        }

        return false;
    }).then((canCreateMajor) => {
        if (canCreateMajor) {
            let newMajor = new Major({
                university: req.body.university,
                facultyID: req.params.facultyId,
                majorName: req.body.majorName,
                majorID: req.body.majorID
            });
            newMajor.save().then((newMajorDoc) => {
                res.send(newMajorDoc);
            })
        } else {
            res.sendStatus(404);
        }
    })
})

router.put('/major/:id', (req, res) => {
    Major.findOneAndUpdate({ _id: req.params.id}, {
        $set: req.body
    }).then(() => {
        res.send({ 'message': 'updated successfully'});
    });
})

router.delete('/major/:id', (req, res) => {
    Major.findOneAndRemove({
        _id: req.params.id
    }).then((removedListDoc) => {
        res.send(removedListDoc);

        // delete all the tasks that are in the deleted list
        deleteTasksFromList(removedListDoc._id);
    })
})

//Exam cluster
router.get('/exam-cluster', (req, res) => {
    ExamCluster.find({
        ClusterName: req.clusterName
    }).then((cluster) => {
        res.json(cluster);
    }).catch((e) => {
        res.send(e);
    });
})

router.post('/exam-cluster', (req, res) => {
    let clusterData = req.body
    let cluster = new ExamCluster(clusterData)

    //save in database
    cluster
    .save(cluster)
    .then(data => {
        res.send(data)
    }).catch(err => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while creating the Tutorial."
        })
    })
})

router.put('/exam-cluster/:id', (req, res) => {
    ExamCluster.findOneAndUpdate({ _id: req.params.id}, {
        $set: req.body
    }).then(() => {
        res.send({ 'message': 'updated successfully'});
    });
})

router.delete('/exam-cluster/:id', (req, res) => {
    ExamCluster.findOneAndRemove({
        _id: req.params.id
    }).then((removedListDoc) => {
        res.send(removedListDoc);

        // delete all the tasks that are in the deleted list
        deleteTasksFromList(removedListDoc._id);
    })
})

//Exam location
router.get('/exam-location', (req, res) => {
    ExamLocation.find({
        LocationName: req.locationName
    }).then((location) => {
        res.json(location);
    }).catch((e) => {
        res.send(e);
    });
})

router.post('/exam-location', (req, res) => {
    let locationData = req.body
    let location = new ExamLocation(locationData)

    //save in database
    location
    .save(location)
    .then(data => {
        res.send(data)
    }).catch(err => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while creating the Tutorial."
        })
    })
})

router.put('/exam-location/:id', (req, res) => {
    ExamLocation.findOneAndUpdate({ _id: req.params.id }, {
        $set: req.body
    }).then(() => {
        res.send({ 'message': 'updated successfully'});
    });
})

router.delete('/exam-location/:id', (req, res) => {
    ExamLocation.findOneAndRemove({
        _id: req.params.id
    }).then((removedListDoc) => {
        res.send(removedListDoc);

        // delete all the tasks that are in the deleted list
        deleteTasksFromList(removedListDoc._id);
    })
})

//Test score
router.get('/test-score', (req, res) => {
    TestScore.find({
        Subject: req.subject
    }).then((testScore) => {
        res.json(testScore);
    }).catch((e) => {
        res.send(e);
    });
})

router.post('/test-score', (req, res) => {
    let testScoreData = req.body
    let testScore = new TestScore(testScoreData)

    //save in database
    testScore
    .save(testScore)
    .then(data => {
        res.send(data)
    }).catch(err => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while creating the Tutorial."
        })
    })
})

router.delete('/test-score/:id', (req, res) => {
    TestScore.findOneAndRemove({
        _id: req.params.id
    }).then((removedListDoc) => {
        res.send(removedListDoc);

        // delete all the tasks that are in the deleted list
        deleteTasksFromList(removedListDoc._id);
    })
})