const foodModel = require('../models/food.model');
const storageService = require('../services/storage.service');
const likeModel = require('../models/likes.model');
const saveModel = require('../models/save.model');
const { v4: uuid } = require("uuid");

async function createFood(req, res) {
    console.log(req.foodPartner)

    console.log(req.body)
    console.log(req.file)

    const fileUploadResult = await storageService.uploadFile(req.file.buffer, uuid())

    const foodItem = await foodModel.create({
        name: req.body.name,
        description: req.body.description,
        video: fileUploadResult.url,
        foodPartner: req.foodPartner._id
    })

    res.status(201).json({
        message: "food created successfully",
        food: foodItem
    })
}

async function  getFoodItems(req, res) {
    const foodItems = await foodModel.find({}).populate('foodPartner', 'name contactName')
    
    // Get the user's liked videos
    const userLikes = await likeModel.find({ user: req.user._id }).select('food');
    const likedVideos = userLikes.map(like => like.food.toString());
    
    // Get the user's saved videos
    const userSaves = await saveModel.find({ user: req.user._id }).select('food');
    const savedVideos = userSaves.map(save => save.food.toString());
    
    res.status(200).json({
        message: "Food Items fetched successfully",
        foodItems,
        likedVideos,
        savedVideos
    })
}

async function likeFood(req, res) {
    const { id } = req.body;
    const user = req.user;

    try {
        const isAlreadyLiked = await likeModel.findOne({ 
            user: user._id,
            food: id 
        });

        if (isAlreadyLiked) {
            // Unlike: Remove from likes collection
            await likeModel.deleteOne({
                user: user._id,
                food: id
            });

            // Decrease like count, ensuring it doesn't go below 0
            const food = await foodModel.findById(id);
            const newCount = Math.max(0, (food.likeCount || 0) - 1);
            
            const updatedFood = await foodModel.findByIdAndUpdate(
                id,
                { likeCount: newCount },
                { new: true }
            );

            return res.status(200).json({
                message: "Food unliked successfully",
                liked: false,
                likeCount: updatedFood.likeCount
            });
        }

        // Like: Add to likes collection
        await likeModel.create({
            user: user._id,
            food: id
        });

        // Increase like count
        const updatedFood = await foodModel.findByIdAndUpdate(
            id,
            { $inc: { likeCount: 1 } },
            { new: true }
        );

        return res.status(201).json({
            message: "Food liked successfully",
            liked: true,
            likeCount: updatedFood.likeCount || 1
        });
    } catch (error) {
        console.error("Error in likeFood:", error);
        return res.status(500).json({
            message: "Error processing like",
            error: error.message
        });
    }
} 

async function saveFood(req, res) {

    const { foodId } = req.body;
    const user = req.user;  

    const isAlreadySaved = await saveModel.findOne({ 
        user: user._id,
        food: foodId 
    })

    if (isAlreadySaved) {
        await saveModel.deleteOne({ 
            user: user._id,
            food: foodId 
        })
        return res.status(200).json({
            message: "Food unsaved successfully",
            saved: false
        })
    }

    const save = await saveModel.create({
        user: user._id,
        food: foodId
    })

    res.status(201).json({
        message: "Food saved successfully",
        saved: true,
        save
    })
}



module.exports = {
    createFood,
    getFoodItems,
    likeFood,
    saveFood
}