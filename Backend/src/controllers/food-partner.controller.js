const foodPartnerModel = require('../models/foodpartner.model');
const foodModel = require('../models/food.model');

async function getFoodPartnerById(req, res) {

    const foodPartnerId = req.params.id;

    const foodPartner = await foodPartnerModel.findById(foodPartnerId)
    const foodItemsByFoodPartner = await foodModel.find({ foodPartner: foodPartnerId })

    if (!foodPartner) {
        return res.status(404).json({ message: "Food partner not found" });
    }

    res.status(200).json({
        message: "Food partner retrieved successfully",
        foodPartner: {
            ...foodPartner.toObject(),
            foodItems: foodItemsByFoodPartner
        }

    });
}

async function getFoodPartnerProfile(req, res) {
    try {
        const foodPartner = req.foodPartner;
        
        if (!foodPartner) {
            return res.status(401).json({
                message: "Food partner not found"
            });
        }

        const foodItems = await foodModel.find({ foodPartner: foodPartner._id });

        res.status(200).json({
            message: "Food partner profile retrieved successfully",
            foodPartner: {
                _id: foodPartner._id,
                email: foodPartner.email,
                name: foodPartner.name,
                contactName: foodPartner.contactName,
                phone: foodPartner.phone,
                address: foodPartner.address,
                createdAt: foodPartner.createdAt,
                foodItems: foodItems,
                totalMeals: foodItems.length
            }
        });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching food partner profile",
            error: error.message
        });
    }
}

module.exports = {
    
    getFoodPartnerById,
    getFoodPartnerProfile
};