const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()

const User = require('../models/user')
const University = require('../models/university')
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

//Authentication
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

//University
router.get('/university', (req, res) => {
    University.find({
        UniversityName: req.universityName
    }).then((university) => {
        res.json(university);
    }).catch((e) => {
        res.send(e);
    });
})

router.post('/university', (req, res) => {
    let universityData = req.body
    let university = new University(universityData)

    //save in database
    university
    .save(university)
    .then(data => {
        res.send(data)
    }).catch(err => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while creating the Tutorial."
        })
    })
})

// Faculty
router.get('/university/:universityId/faculty', (req, res) => {
    Faculty.find({
        uniID: req.params.universityId
    }).then((faculty) => {
        res.json(faculty);
    }).catch((e) => {
        res.send(e);
    });
})

router.post('/university/:universityId/faculty', (req, res) => {
    University.findOne({
        _id: req.params.universityId
    }).then((university) => {
        if (university) {
            return true;
        }

        return false;
    }).then((canCreateFaculty) => {
        if (canCreateFaculty) {
            let newFaculty = new Faculty({
                uniID: req.params.universityId,
                facultyName: req.body.facultyName,
                facultyID: req.body.facultyID
            });
            newFaculty.save().then((newFacultyDoc) => {
                res.send(newFacultyDoc);
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
router.get('/exam-cluster/:clusterId/exam-location', (req, res) => {
    ExamLocation.find({
        cltID: req.params.clusterId
    }).then((location) => {
        res.json(location);
    }).catch((e) => {
        res.send(e);
    });
})

router.post('/exam-cluster/:clusterId/exam-location', (req, res) => {
    ExamCluster.findOne({
        _id: req.params.clusterId
    }).then((cluster) => {
        if (cluster) {
            return true;
        }

        return false;
    }).then((canCreateLocation) => {
        if (canCreateLocation) {
            let newLocation = new ExamLocation({
                cltID: req.params.clusterId,
                locationName: req.body.locationName,
                locationID: req.body.locationID,
                address: req.body.address,
                room: req.body.room
            });
            newLocation.save().then((newLocationDoc) => {
                res.send(newLocationDoc);
            })
        } else {
            res.sendStatus(404);
        }
    })
})

router.put('/exam-location/:id', (req, res) => {
    
})

router.delete('/exam-location/:id', (req, res) => {
    
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