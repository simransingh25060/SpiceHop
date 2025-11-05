const userModel = require('../models/user.model');
const foodPartnerModel = require("../models/foodpartner.model")
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

async function loginUser(req, res) { 
    const {email, password} = req.body;

    const user = await userModel.findOne({
        email
    })

    if(!user) {
        return res.status(404).json({   
            message: "Invalid email or password"
})
}

const isPasswordValid = await bcrypt.compare(password, user.password);

if(!isPasswordValid) {
    return res.status(404).json({
        message: "Invalid email or password"
    })  

}

const token = jwt.sign({
    id: user._id,   
    }, process.env.JWT_SECRET)

res.cookie("token", token)

res.status(200).json({
    message: "User logged in successfully",
    user: {
        _id: user._id,
        email: user.email,
        fullName: user.fullName
    }
})


}

function logoutUser(req, res) {
    res.clearCookie("token");
    res.status(200).json({
        message: "User logged out successfully"
    });

}


async function registerFoodPartner(req, res) {

    const {name, email, password} = req.body;

    const isAccountAlreadyExists = await foodPartnerModel.findOne({
        email
    })

    if (isAccountAlreadyExists) {
        return res.status(400).json({
            message: "Food partner account already exists"
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const foodPartner = await foodPartnerModel.create({
        name,
        email,
        password: hashedPassword
    })

    const token = jwt.sign({
        id: foodPartner._id,
    }, process.env.JWT_SECRET)

    res.cookie("token", token)

    res.status(201).json({
        message: "Food partner registered successfully",
        foodPartner: {
            _id: foodPartner._id,
            email: foodPartner.email,
            name: foodPartner.name
        }
    })
    

}

async function loginFoodPartner(req, res) {

    const {email, password} = req.body; 

    const foodPartner = await foodPartnerModel.findOne({
        email
    })

    if(!foodPartner) {
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, foodPartner.password);

    if(!isPasswordValid) {
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    const token = jwt.sign({
        id: foodPartner._id,
    }, process.env.JWT_SECRET)

    res.cookie("token", token)

    res.status(201).json({
        message: "Food partner logged in successfully",
        foodPartner: {
            _id: foodPartner._id,
            email: foodPartner.email,
            name: foodPartner.name
        }
    })

}

function logoutFoodPartner(req, res) {
    res.clearCookie("token");
    res.status(200).json({
        message: "Food partner logged out successfully"
    });

}

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    registerFoodPartner,
    loginFoodPartner,
    logoutFoodPartner
}



//password- hashing => data in database is secure
//password- not sent to frontend

//to know request of user- token - saved in cookies- 
// 1.jsonwebtoken to create , 2.cookieparser(used as middleware)

//*one export in one file so, export multiple controller in object 