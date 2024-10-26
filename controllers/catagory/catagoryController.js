const Category = require("../../models/catagoryModel"); // Correct spelling
const asyncErrorHandler = require('../../utils/asyncErrorHandler');
const CustomError = require('../../utils/CustomError');

const createCategory = async (req, res,next) => {
    const categoryData = req.body; // Renamed for clarity

    try {
        // Check if the category already exists
        const existingCategory = await Category.findOne({ name: categoryData.name });
        if (existingCategory) {
            return res.status(400).json({
                success: false,
                message: "Category already exists",
            });
        }

        // Create a new category instance
        const newCategory = new Category(categoryData);

        // Save the new category to the database
        await newCategory.save();

        return res.status(201).json({
            success: true,
            message: "Category created successfully",
            category: newCategory,
        });
    } catch (error) {
        console.error("Error creating category:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while creating category",
        });
    }
};

const getAllCategory = async (req, res,next) => {
    try {
        // Retrieve all categories from the database
        const categories = await Category.find();

        // Check if there are any categories
        if (!categories.length) {
            return res.status(404).json({
                success: false,
                message: "No categories found",
            });
        }

        // Return the list of categories
        return res.status(200).json({
            success: true,
            categories: categories,
        });
    } catch (error) {
        console.error("Error fetching categories:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while fetching categories",
        });
    }
};

module.exports = { 
    createCategory,
    getAllCategory

 }; // Export the function for use in your routes
