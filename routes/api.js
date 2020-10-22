const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()

const Admin = require('../models/admin')
const University = require('../models/university')
const ExamCluster = require('../models/exam-cluster')
const ExamLocation = require('../models/exam-location')
const Exam = require('../models/exam')
const Post = require('../models/post')
const Major = require('../models/major')
const Combination = require('../models/combination')
const TimeLine = require('../models/time-line')

const mongoose = require('mongoose')


mongoose.connect('mongodb+srv://admin:admin@nambp-mongodb.bae7r.mongodb.net/university-exam-meta', {useNewUrlParser: true, useUnifiedTopology: true}, function(err){
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
    let adminData = req.body
    let admin = new Admin(adminData)
    admin.save((error, registeredAdmin) => {
        if(error){
            console.log(error)
        }else {
            let payload = { subject: registeredAdmin._id}
            let token = jwt.sign(payload, 'sevretKey')

            res.status(200).send({token})
        }
    })
})

router.post('/login', (req, res) =>{
    let adminData = req.body

    Admin.findOne({email: adminData.email}, (error, admin) =>{
        if(error){
            console.log(error)
        }else{
            if(!admin){
                res.status(401).send('Invalid email')
            }else{
                if(admin.password !== adminData.password){
                    res.status(401).send('Invalid password')
                }else{
                    let payload = { subject: admin._id}
                    let token = jwt.sign(payload, 'secretKey')
                    res.status(200).send({token})
                }
            }
        }
    })
})



//University - done 
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

router.put('/university/:id', (req, res) => {
    University.findOneAndUpdate({ _id: req.params.id}, {
        $set: req.body
    }).then(() => {
        res.send({ 'message': 'updated successfully'});
    });
})

router.delete('/university/:id', (req, res) => {
    University.findOneAndRemove({
        _id: req.params.id
    }).then((removedUniversityDoc) => {
        res.send(removedUniversityDoc);

        deleteTasksFromList(removedUniversityDoc._id);
    })
})




// Post - done
router.get('/university/:universityId/posts', (req, res) => {
    Post.find({
        uniID: req.params.universityId
    }).then((post) => {
        res.json(post);
    }).catch((e) => {
        res.send(e);
    });
})

router.post('/university/:universityId/posts', (req, res) => {
    University.findOne({
        _id: req.params.universityId
    }).then((university) => {
        if (university) {
            return true;
        }

        return false;
    }).then((canCreatePosts) => {
        if (canCreatePosts) {
            let newPost = new Post({
                uniID: req.params.universityId,
                facultyName: req.body.facultyName,
                majorName: req.body.majorName,
                content: req.body.content,
                date_posted: req.body.date_posted
            });
            newPost.save().then((newPostDoc) => {
                res.send(newPostDoc);
            })
        } else {
            res.sendStatus(404);
        }
    })
})

router.put('/university/:universityId/posts/:postId', (req, res) => {
    University.findOne({
        _id: req.params.universityId
    }).then((university) => {
        if (university) {
            return true;
        }

        return false;
    }).then((canUpdatePost) => {
        if (canUpdatePost) {
            Post.findOneAndUpdate({
                _id: req.params.postId,
                uniID: req.params.universityId
            }, {
                    $set: req.body
                }
            ).then(() => {
                res.send({ message: 'Updated successfully.' })
            })
        } else {
            res.sendStatus(404);
        }
    })
})

router.delete('/university/:universityId/posts/:postId', (req, res) => {
    University.findOne({
        _id: req.params.universityId
    }).then((university) => {
        if (university) {
            return true;
        }

        return false;
    }).then((canDeletePost) => {
        
        if (canDeletePost) {
            Post.findOneAndRemove({
                _id: req.params.postId,
                uniID: req.params.universityId
            }).then((removedPostDoc) => {
                res.send(removedPostDoc);
            })
        } else {
            res.sendStatus(404);
        }
    });
})


//Major - done
router.get('/university/:universityId/major', (req, res) => {
    Major.find({
        university_id: req.params.universityId
    }).then((major) => {
        res.json(major);
    }).catch((e) => {
        res.send(e);
    });
})

router.post('/university/:universityId/major', (req, res) => {
    University.findOne({
        _id: req.params.universityId
    }).then((university) => {
        if (university) {
            return true;
        }

        return false;
    }).then((canCreateMajors) => {
        if (canCreateMajors) {
            let newMajor = new Major({
                university_id: req.params.universityId,
                department_name: req.body.department_name,
                department_id: req.body.department_id,
                major_name: req.body.major_name,
                major_id: req.body.major_id,
                combination: req.body.combination,
                info: req.body.info,
                degree: req.body.degree,
                training_time: req.body.training_time
            });
            newMajor.save().then((newMajorDoc) => {
                res.send(newMajorDoc);
            })
        } else {
            res.sendStatus(404);
        }
    })
})

router.put('/university/:universityId/major/:majorId', (req, res) => {
    University.findOne({
        _id: req.params.universityId
    }).then((university) => {
        if (university) {
            return true;
        }

        return false;
    }).then((canUpdateMajor) => {
        if (canUpdateMajor) {
            Major.findOneAndUpdate({
                _id: req.params.majorId,
                university_id: req.params.universityId
            }, {
                    $set: req.body
                }
            ).then(() => {
                res.send({ message: 'Updated successfully.' })
            })
        } else {
            res.sendStatus(404);
        }
    })
})

router.delete('/university/:universityId/major/:majorId', (req, res) => {
    University.findOne({
        _id: req.params.universityId
    }).then((university) => {
        if (university) {
            return true;
        }

        return false;
    }).then((canDeleteMajor) => {
        
        if (canDeleteMajor) {
            Major.findOneAndRemove({
                _id: req.params.majorId,
                university_id: req.params.universityId
            }).then((removedMajorDoc) => {
                res.send(removedMajorDoc);
            })
        } else {
            res.sendStatus(404);
        }
    });
})



//Exam cluster - done
router.get('/exam-cluster', (req, res) => {
    ExamCluster.find({
        ClusterName: req.exam_cluster_name
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
    }).then((removedClusterDoc) => {
        res.send(removedClusterDoc);

        deleteTasksFromList(removedClusterDoc._id);
    })
})



//Exam location - done
router.get('/exam-cluster/:clusterId/exam-location', (req, res) => {
    ExamLocation.find({
        exam_cluster_id: req.params.clusterId
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
                exam_cluster_id: req.params.clusterId,
                exam_cluster_name: req.body.exam_cluster_name,
                exam_location_id: req.body.exam_location_id,
                location: req.body.location,
                address: req.body.address,
                exam_room_number: req.body.exam_room_number,
                limit_student: req.body.limit_student
            });
            newLocation.save().then((newLocationDoc) => {
                res.send(newLocationDoc);
            })
        } else {
            res.sendStatus(404);
        }
    })
})

router.put('/exam-cluster/:clusterId/exam-location/:locationId', (req, res) => {
    ExamCluster.findOne({
        _id: req.params.clusterId
    }).then((cluster) => {
        if (cluster) {
            return true;
        }

        return false;
    }).then((canUpdateLocation) => {
        if (canUpdateLocation) {
            // the currently authenticated user can update tasks
            ExamLocation.findOneAndUpdate({
                _id: req.params.locationId,
                exam_cluster_id: req.params.clusterId
            }, {
                    $set: req.body
                }
            ).then(() => {
                res.send({ message: 'Updated successfully.' })
            })
        } else {
            res.sendStatus(404);
        }
    })
})

router.delete('/exam-cluster/:clusterId/exam-location/:locationId', (req, res) => {
    ExamCluster.findOne({
        _id: req.params.clusterId
    }).then((cluster) => {
        if (cluster) {
            return true;
        }

        return false;
    }).then((canDeleteLocation) => {
        
        if (canDeleteLocation) {
            ExamLocation.findOneAndRemove({
                _id: req.params.locationId,
                exam_cluster_id: req.params.clusterId
            }).then((removedLocationDoc) => {
                res.send(removedLocationDoc);
            })
        } else {
            res.sendStatus(404);
        }
    });
})


//Combination - done 
router.get('/combination', (req, res) => {
    Combination.find({
        CombinationID: req.combination_id
    }).then((combination) => {
        res.json(combination);
    }).catch((e) => {
        res.send(e);
    });
})

router.post('/combination', (req, res) => {
    let combinationData = req.body
    let combination = new Combination(combinationData)

    //save in database
    combination
    .save(combination)
    .then(data => {
        res.send(data)
    }).catch(err => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while creating the Tutorial."
        })
    })
})

router.put('/combination/:id', (req, res) => {
    Combination.findOneAndUpdate({ _id: req.params.id}, {
        $set: req.body
    }).then(() => {
        res.send({ 'message': 'updated successfully'});
    });
})

router.delete('/combination/:id', (req, res) => {
    Combination.findOneAndRemove({
        _id: req.params.id
    }).then((removedCombinationDoc) => {
        res.send(removedCombinationDoc);

        // delete all the tasks that are in the deleted list
        deleteTasksFromList(removedCombinationDoc._id);
    })
})


//Exam
router.get('/exam', (req, res) => {
    Exam.find({
        ExamName: req.exam_name
    }).then((exam) => {
        res.json(exam);
    }).catch((e) => {
        res.send(e);
    });
})

router.post('/exam', (req, res) => {
    let examData = req.body
    let exam = new Exam(examData)

    //save in database
    exam
    .save(exam)
    .then(data => {
        res.send(data)
    }).catch(err => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while creating the Tutorial."
        })
    })
})

router.put('/exam/:id', (req, res) => {
    Exam.findOneAndUpdate({ _id: req.params.id}, {
        $set: req.body
    }).then(() => {
        res.send({ 'message': 'updated successfully'});
    });
})

router.delete('/exam/:id', (req, res) => {
    Exam.findOneAndRemove({
        _id: req.params.id
    }).then((removedExamDoc) => {
        res.send(removedExamDoc);

        // delete all the tasks that are in the deleted list
        deleteTasksFromList(removedExamDoc._id);
    })
})


//Time Line
router.get('/time-line', (req, res) => {
    TimeLine.find({
        Subject: req.subject
    }).then((timeLine) => {
        res.json(timeLine);
    }).catch((e) => {
        res.send(e);
    });
})

router.post('/time-line', (req, res) => {
    let timeLineData = req.body
    let timeLine = new TimeLine(timeLineData)

    //save in database
    timeLine
    .save(timeLine)
    .then(data => {
        res.send(data)
    }).catch(err => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while creating the Tutorial."
        })
    })
})

router.put('/time-line/:id', (req, res) => {
    TimeLine.findOneAndUpdate({ _id: req.params.id}, {
        $set: req.body
    }).then(() => {
        res.send({ 'message': 'updated successfully'});
    });
})

router.delete('/timeline/:id', (req, res) => {
    TimeLine.findOneAndRemove({
        _id: req.params.id
    }).then((removedTimeLineDoc) => {
        res.send(removedTimeLineDoc);

        // delete all the tasks that are in the deleted list
        deleteTasksFromList(removedTimeLineDoc._id);
    })
})