const fs = require('fs');
const path = require('path');
const userModel = require('../models/user.model');
const foodPartnerModel = require("../models/foodpartner.model")
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;

async function updateUser(req, res) {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: 'Not authenticated' });
    

    const update = {};

    if (req.body.name) update.fullName = req.body.name;
    if (req.body.email) update.email = req.body.email;


    if (req.file && req.file.path) {
      update.profilePic = req.file.path;
    }

    if (Object.keys(update).length === 0) {
      return res.status(400).json({ message: "No update fields provided" });
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      user._id,
      update,
      { new: true }
    );

    return res.status(200).json({
      message: "Profile updated",
      user: updatedUser,
    });
  } catch (err) {
    console.error("updateUser error", err);
    return res.status(500).json({
      message: "Error updating profile",
      error: err.message,
    });
  }
}


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
async function getUserProfile(req, res) {
    try {
        const user = req.user;
        
        if (!user) {
            return res.status(401).json({
                message: "User not found"
            });
        }

        // Import models inline to get stats
        const likeModel = require('../models/likes.model');
        const saveModel = require('../models/save.model');

        // Get counts
        const likedCount = await likeModel.countDocuments({ user: user._id });
        const savedCount = await saveModel.countDocuments({ user: user._id });

        res.status(200).json({
            _id: user._id,
            profilePic: user.profilePic || null,
            email: user.email,
            name: user.fullName,
            fullName: user.fullName,
            createdAt: user.createdAt,
            stats: {
                liked: likedCount,
                saved: savedCount
            }
        });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching user profile",
            error: error.message
        });
    }
}


async function registerFoodPartner(req, res) {

    const {name, email, password, phone, address, contactName} = req.body;

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
        password: hashedPassword,
        phone,
        address,
        contactName
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
            name: foodPartner.name,
            address: foodPartner.address,
            contactName: foodPartner.contactName,
            phone: foodPartner.phone
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
    logoutFoodPartner,
    getUserProfile
    ,
    updateUser
}




//password- hashing => data in database is secure
//password- not sent to frontend

//to know request of user- token - saved in cookies- 
// 1.jsonwebtoken to create , 2.cookieparser(used as middleware)

//*one export in one file so, export multiple controller in object 