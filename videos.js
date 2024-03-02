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
const inboxModel = require('./models/inbox')
const communityModel = require('./models/community')
const communityMessageModel = require('./models/communityMessage')


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
app.get('/Queries', (req, res) => {
    inboxModel.find()
        .then(user => res.json(user))
        .catch(err => res.json(err))
})
app.get('/AssessmentResult', (req, res) => {

    resultModel.find()
        .then(user => res.json(user))
        .catch(err => res.json(err))
})
//  Community GET

app.get('/communities', (req, res) => {
    communityModel.find()
        .then(response => res.json(response))
        .catch(err => res.json(err))
})
app.get('/communities/messages', (req, res) => {
    communityMessageModel.find()
        .then(response => res.json(response))
        .catch(err => res.json(err))
})


app.get('/communities/Dashboard/:name', async (req, res) => {
    const name = req.params.name;

    const community = await communityModel.find({ name: name });
    try {
        if (community) {
            return res.status(200).json(community);
        } else {
            return res.status(404).json({ message: "Community not found" });
        }
    } catch (err) {
        console.error("Error fetching community:", err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});



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
    const { email, password } = req.body;

    try {
        const user = await UserModel.findOne({ email: email });

        if (user) {
            // Check if the password matches
            if (user.password === password) {

                // Respond with JSON data containing user's information
                res.json({ auth: true, user: user });
            } else {
                // If the password doesn't match, respond with JSON indicating incorrect password
                res.json("incorrect");
            }
        } else {
            // If no user found with the provided email, respond with JSON indicating user does not exist
            res.json("notexist");
        }
    } catch (error) {
        // If an error occurs, respond with JSON indicating server error
        console.error(error);
        res.status(500).json("server error");
    }
});

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
        } else {
            res.json("notexist")
            await UserModel.insertMany([data])
        }
    } catch (error) {
        console.log(error);
        res.json("invalid")
    }

})



// for adding a query 
app.post('/Queries', async (req, res) => {
    const { email, subject, message, time } = req.body;


    const data = {
        email: email,
        subject: subject,
        message: message,



    }
    try {
        await inboxModel.insertMany([data]);
        // console.log("Data inserted:", data);
        res.json("added");
    } catch (error) {
        console.error("Error inserting data:", error);
        res.status(500).json("nadded");
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
    const { subject, unit, source, notesUrl, comment, branch, semester } = req.body;

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
app.get('/LogAssessment/viewResult', (req, res) => {
    resultModel.find()
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
    const { marks, user, currentAssesment, status, subject, number } = req.body

    const data = {
        marks: marks,
        name: user,
        AssesmentId: currentAssesment,
        status: status,
        subject: subject,
        number: number,

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

// put request 

app.put('/updateStatus/:id', async (req, res) => {
    try {
        const id = req.params.id;
        // console.log(id);

        const filter = { _id: id };
        const update = { isPlus: true }; // Assuming `isPlus` is the field you want to update

        await UserModel.findByIdAndUpdate(filter, update);

        const updatedUser = await UserModel.findOne(filter);
        // console.log('Updated user:', updatedUser);

        res.status(200).json("updated");
    } catch (error) {
        console.error('Error updating user status:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// update inbox diplayed  
app.put('/setDisplayed/:id', async (req, res) => {
    try {
        const id = req.params.id; // Retrieve the ID from the request body

        const filter = { _id: id };
        const update = { displayed: true };

        await inboxModel.findByIdAndUpdate(filter, update);

        const updatedMessage = await inboxModel.findOne(filter);
        // console.log('Updated message:', updatedMessage);

        res.status(200).json("updated");
    } catch (error) {
        console.error('Error updating message status:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Community 

app.post('/communites', async (req, res) => {
    const { name, member, primeMember, image, dateCreated, description, tags, category } = req.body

    const data = {
        name: name,
        member: member,
        primeMember: primeMember,
        image: image,
        dateCreated: dateCreated,
        description: description,
        tags: tags,
        category: category
    }

    try {
        const check = await communityModel.findOne({ name: name })
        if (check) {
            res.json("exist")
        } else {
            res.json("notexist")
            await communityModel.insertMany([data])
        }
    } catch (error) {
        console.log(error);
        res.json("invalid")
    }

})
//Community Messages ]
app.post('/communities/messages', async (req, res) => {
    const { author, message, communityCell } = req.body

    const data = {
        author: author,
        message: message,
        communityCell: communityCell,
    }
    try {
        const check = await communityModel.findOne({ name: communityCell })
        if (check) {
            res.json("sent")
            await communityMessageModel.insertMany([data])
            // console.log(data)
        } else {
            res.json("notexist")
        }
    } catch (error) {
        console.log(error);
        res.json("invalid")
    }

})

// put request

app.put('/communities/:name/add-member', async (req, res) => {
    const communityId = req.params.name; // Extract the community ID from the request parameters
    const { newMember } = req.body; // Extract the new member from the request body

    try {
        const community = await communityModel.findOne({ name: communityId }); // Find the community by ID
        if (!community) {
            return res.status(404).json({ error: "Community not found" });
        }

        // Check if the new member is already in the community
        if (community.member.includes(newMember)) {
            return res.status(400).json({ error: "Member already exists in the community" });
        }

        // Add the new member to the community
        community.member.push(newMember);

        // Save the updated community
        await community.save();

        res.json({ message: "New member added to the community", community });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});


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