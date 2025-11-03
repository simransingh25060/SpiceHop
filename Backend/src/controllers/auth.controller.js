const userModel = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


async function registerUser(req, res) {

    const {fullName, email, password} = req.body;

    const isUserAlreadyExists = await userModel.findOne({
        email
    })

    if (isUserAlreadyExists) {
        return res.status(400).json({
            message: "User already exists"
        })
}

const hashedPassword = await bcrypt.hash(password, 10);

const user = await userModel.create({
    fullName,
    email, 
    password: hashedPassword

})

const token = jwt.sign({
    id:user._id,
}, process.env.JWT_SECRET)
res.cookie("token", token )

res.status(201).json({
    message: "User registered successfully",
    user:{  
        _id: user._id,
        email: user.email,
        fullName: user.fullName
    }
})
}

async function loginUser(req, res) { }

module.exports = {
    registerUser,
    loginUser
}

//password- hashing => data in database is secure
//password- not sent to frontend

//to know request of user- token - saved in cookies- 
// 1.jsonwebtoken to create , 2.cookieparser(used as middleware)

//*one export in one file so, export multiple controller in object 