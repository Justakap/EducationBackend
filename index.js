require('dotenv').config();
const PORT1 = process.env.PORT;
const host = process.env.REACT_APP_API_BASE_URL;
const DATABASE = process.env.DATABASE_URL;
const port = PORT1 || 5003
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const vidModel = require('./models/videos')
const branchModel = require('./models/branches')
const subjectModel = require('./models/subject')
const UserModel = require('./models/user')
const ejs = require('ejs');
const session = require("express-session")
const cookieParser = require("cookie-parser")
const questionModel = require('./models/question')
const assesmentModel = require('./models/assesment')
const { default: axios } = require('axios')
const { findOne } = require('./models/question')
const resultModel = require('./models/result')

const app = express()

app.use(cors({
    origin: 'https://markeducation.netlify.app',
    credentials: true,
}));
app.use(express.json())
app.use(cookieParser())
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60 * 24
    }
}))


mongoose.connect(DATABASE).then(() => {
    console.log("success mon")
})

app.get('/getData', (req, res) => {
    vidModel.find()
        .then(users => res.json(users))
        .catch(err => res.json(err))
})

app.get('/getDataUser', (req, res) => {
    UserModel.find()
        .then(users => res.json(users))
        .catch(err => res.json(err))
})

app.get('/branches', (req, res) => {
    branchModel.find()
        .then(users => res.json(users))
        .catch(err => res.json(err))
})
app.get('/subjects', (req, res) => {
    subjectModel.find()
        .then(subject => res.json(subject))
        .catch(err => res.json(err))
})
app.get('/user', (req, res) => {
    UserModel.find()
        .then(user => res.json(user))
        .catch(err => res.json(err))
})
app.get('/subject', (req, res) => {

    res.status(200).render('subject.ejs');
})
app.get('/home', (req, res) => {

    if (req.session.username) {
        return res.json({ valid: true, username: req.session.username })
    }
    else {
        return res.json({ valid: false })
    }
})
app.get('/profile', (req, res) => {

    if (req.session.username) {
        return res.json({ valid: true, username: req.session.username })
    }
    else {
        return res.json({ valid: false })
    }
})


// post only

app.post('/login', async (req, res) => {
    const { email, password } = req.body

    try {
        const check = await UserModel.findOne({ email: email })
        const check2 = await UserModel.findOne({ email: email, password: password })
        if (check) {
            if (check2) {
                req.session.username = email;
                console.log(req.session.username)
                res.json({ login: true, username: req.session.username })
            }
            else if (!check2) {
                res.json("incorrect")
            }
        }
        else {

            res.json("notexist")
        }

    } catch (error) {
        // console.log(err)
        res.json("not exist")
    }
})

// signup

app.post('/signup', async (req, res) => {
    const { name, email, password, contact, branch, year } = req.body

    const data = {
        email: email,
        password: password,
        name: name,
        contact: contact,
        branch: branch,
        year: year,
    }

    try {
        const check = await UserModel.findOne({ email: email })
        if (check) {
            res.json("exist")
        }
        else {

            res.json("notexist")
            await UserModel.insertMany([data])
        }

    } catch (error) {
        // console.log(err)
        res.json("not exist")
    }
})



// for adding a subject 
app.post('/addResource/addSubject', (req, res) => {
    const { name, semester, image, branch } = req.body;

    const subject = new subjectModel({ name: name, semester: semester, image: image, branch: branch })

    subject.save().then(() => {
        res.send(console.log("hogya"))

    }).catch(err => { console.log(err) })

})

//add video 
app.post('/addResource/addVideo', (req, res) => {
    const { branch, subject, count, source, notesUrl, pyq } = req.body;

    const video = new vidModel({ branch: branch, subject: subject, count: count, source: source, notesUrl: notesUrl, pyq: pyq })
    video.save().then(() => {
        res.status(200).send('Video added successfully!');
    })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Internal Server Error');
        });
})
//add branch 
app.post('/addResource/addBranch', (req, res) => {
    const { branch, image } = req.body;
    const branches = new branchModel({ branch: branch, image: image })
    branches.save().then(() => {
        res.status(200).send('branch added successfully!');
    })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Internal Server Error');
        });
})
// add user 
app.post('/register', (req, res) => {
    const { name, email, contact, password } = req.body;
    const users = new UserModel({ name: name, email: email, contact: contact, password: password })
    users.save().then(() => {
        res.status(200).send('user added successfully!');
    })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Internal Server Error');
        });
})


// mark College 


// Assesment 
app.get('/question', (req, res) => {
    questionModel.find()
        .then(user => res.json(user))
        .catch(err => res.json(err))
})
app.get('/assesment', (req, res) => {
    assesmentModel.find()
        .then(user => res.json(user))
        .catch(err => res.json(err))
})
app.get('/assesment/addAssesment', (req, res) => {
    assesmentModel.find()
        .then(user => res.json(user))
        .catch(err => res.json(err))
})
app.post('/assesment/addQuestion', (req, res) => {
    const { AssesmentId, question, opt1, opt2, opt3, opt4, ans } = req.body

    const data = {
        AssesmentId: AssesmentId,
        question: question,
        opt1: opt1,
        opt2: opt2,
        opt3: opt3,
        opt4: opt4,
        ans: ans,
    }

    try {
        if (data) {
            questionModel.insertMany([data])
            res.json("added")
            console.log(data)
        }
        else {

            res.json("nadded")
        }
    } catch (error) {
        // console.log(err)
        res.json("not exist")
    }
})

// add assesment
app.post('/assesment/addAssesment', async (req, res) => {
    const { subject, number, TotalQuestion } = req.body

    const data = {
        subject: subject,
        number: number,
        TotalQuestion: TotalQuestion,

    }

    try {

        const check = await assesmentModel.findOne({ subject: subject, number: number });

        if (!check) {
            assesmentModel.insertMany([data])
            res.json("added")
            console.log(data)
        }
        else if (check) {
            res.json("exist")

        }
        else {

            res.json("nadded")
        }
    } catch (error) {
        // console.log(err)
        res.json("not exist")
    }
})

//

app.post('/assesment/result', (req, res) => {
    const { marks, name, currentAssesment, status } = req.body

    const data = {
        marks: marks,
        name: name,
        AssesmentId: currentAssesment,
        status: status,

    }

    try {
        if (data) {
            resultModel.insertMany([data])
            res.json("added")
            // console.log(data)
        }
        else {

            res.json("nadded")
        }
    } catch (error) {
        // console.log(err)
        res.json("not exist")
    }
})

//





app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})

// subjectModel.create(data)
// .then((result) => {
//     console.log(result);
//     // res.redirect('/register');

// })
// .catch((error) => {
//     console.error(error);
//     res.status(500).send('Internal Server Error'); // Send an appropriate error response
// });