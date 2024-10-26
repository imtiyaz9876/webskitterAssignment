const Question = require("../../models/questionModel");
const fs = require("fs");
const csv = require("csv-parser");

const createQuestion = async (req, res) => {
    const { question, categories } = req.body; // Destructure the required fields from the request body

    try {
        // Create a new instance of the Question model with question text and categories
        const newQuestion = new Question({
            question, // This will be the text of the question
            categories // This will be an array of categories
        });

        // Save the new question to the database
        await newQuestion.save();

        // Return success response
        return res.status(201).json({
            success: true,
            message: "Question created successfully",
            question: newQuestion, // Optionally return the created question
        });
    } catch (error) {
        console.error("Error creating question:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while creating question",
        });
    }
};

const questionCategoryWise = async (req, res) => {
    const { category } = req.params; // Get the category from request parameters

    try {
        // Find all questions that belong to the specified category
        const questions = await Question.find({ categories: category }); // Match against the categories array

        // Check if any questions are found
        if (questions.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No questions found for this category",
            });
        }

        // Return the list of questions found
        return res.status(200).json({
            success: true,
            questions: questions,
        });
    } catch (error) {
        console.error("Error fetching questions by category:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while fetching questions",
        });
    }
};

const addQuestionInBulk = async (req, res) => {
    const results = [];

    // Check if a file was uploaded
    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: "No file uploaded",
        });
    }

    // Read and parse the CSV file
    fs.createReadStream(req.file.path)
        .pipe(csv())
        .on("data", (data) => results.push(data))
        .on("end", async () => {
            try {
                // Iterate over parsed results and save to the database
                for (const item of results) {
                    const { question, categories } = item;
                    const newQuestion = new Question({
                        question,
                        categories: categories.split(",").map(cat => cat.trim()), // Split categories into an array
                    });
                    await newQuestion.save();
                }
                return res.status(201).json({
                    success: true,
                    message: "Questions uploaded successfully",
                });
            } catch (error) {
                console.error("Error uploading questions:", error);
                return res.status(500).json({
                    success: false,
                    message: "Server error while uploading questions",
                });
            }
        });
};

module.exports = { 
    
    createQuestion,
    questionCategoryWise,
    addQuestionInBulk
};
