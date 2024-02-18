const port = 5003
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
const gradeModel = require('./models/grade')
const unitModel = require('./models/units')
const resourceModel = require('./models/resources')


const app = express()

// app.use(cors({
//     origin: ["http://localhost:3000"],
//     methods: ["POST", "GET"],
//     credentials: true
// }
// ))]
app.use(cors({
    origin: 'https://markeducation.netlify.app',
    // origin: ["http://localhost:3000"],
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


mongoose.connect("mongodb+srv://anantk15:root@cluster0.972saxu.mongodb.net/videos?retryWrites=true&w=majority").then(() => {
    console.log("success mon")
})

app.get('/grade', (req, res) => {
    gradeModel.find()
        .then(data => res.json(data))
        .catch(err => res.json(err))
})
app.get('/getData', (req, res) => {
    vidModel.find()
        .then(users => res.json(users))
        .catch(err => res.json(err))
})
app.get('/branches', (req, res) => {
    branchModel.find()
        .then(users => res.json(users))
        .catch(err => res.json(err))
})
app.get('/resources', (req, res) => {
    resourceModel.find()
        .then(users => res.json(users))
        .catch(err => res.json(err))
})
app.get('/subjects', (req, res) => {
    subjectModel.find()
        .then(subject => res.json(subject))
        .catch(err => res.json(err))
})
app.get('/unit', (req, res) => {
    unitModel.find()
        .then(unit => res.json(unit))
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
app.post('/Modify/Subject/add', async (req, res) => {
    const { name, semester, image, branch } = req.body;


    const data = {
        name: name,
        semester: semester,
        image: image,
        branch: branch,

    }
    const check = await subjectModel.findOne({ branch: branch, name: name });

    if (check) {
        // Subject with the same number or name already exists
        res.json("exist");
    } else {
        // Subject does not exist, so insert it
        try {
            await subjectModel.insertMany([data]);
            // console.log("Data inserted:", data); 
            res.json("added");
        } catch (error) {
            console.error("Error inserting data:", error);
            res.status(500).json("nadded");
        }
    }


})

//add video 

app.post('/Modify/Video/Add', async (req, res) => {
    const { subject, unit, source, notesUrl, comment,branch,semester } = req.body;

    const data = {
        subject: subject,
        unit: unit,
        source: source,
        notesUrl: notesUrl,
        comment: comment,
        branch: branch,
        semester: semester
    };

    try {
        const check = await vidModel.findOne({ source: source });

        if (check) {
            // Video with the same source already exists
            return res.json("exist");
// 
        } else {
            // Video does not exist, so insert it
            await vidModel.create(data);
            // console.log("Data inserted:", data);
            return res.json("added");
        }
    } catch (error) {
        console.error("Error inserting data:", error);
        return res.status(500).json("nadded");
    }
});
//add branch 
app.post('/Modify/Branch', async (req, res) => {
    const { branch, image } = req.body;
    const data = {
        branch: branch,
        image: image,

    }
    const check = await branchModel.findOne({ branch: branch });

    if (check) {
        // Unit with the same number or name already exists
        res.json("exist");
    } else {
        // Unit does not exist, so insert it
        try {
            await branchModel.insertMany([data]);
            // console.log("Data inserted:", data);
            res.json("added");
        } catch (error) {
            console.error("Error inserting data:", error);
            res.status(500).json("nadded");
        }
    }

})
//add unit 
app.post('/modify/unit/add', async (req, res) => {
    const { subject, unitName, unitNumber } = req.body;

    const data = {
        subject: subject,
        unit: [{
            number: unitNumber,
            name: unitName,
        }]
    }
    const check = await unitModel.findOne({
        $or: [
            { "unit.name": unitName }
        ]
    });

    if (check) {
        // Unit with the same number or name already exists
        res.json("exist");
    } else {
        // Unit does not exist, so insert it
        try {
            await unitModel.insertMany([data]);
            // console.log("Data inserted:", data);
            res.json("added");
        } catch (error) {
            console.error("Error inserting data:", error);
            res.status(500).json("nadded");
        }
    }

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
app.post('/Modify/Assesment', async (req, res) => {
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