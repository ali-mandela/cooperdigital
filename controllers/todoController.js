const { errorHandler } = require("../config/util");
const todoModel = require("../models/todoModel"); 
const userModel = require('../models/userModel');

module.exports.createTodo = async (req, res) => {
    const { title, description } = req.body;
    const createdBy = req.user?.id;  

    if (!title || !description) {
        return res.status(400).json({
            success: false,
            message: 'Please provide all required fields: title, description.',
        });
    }

    try {
        const user = await userModel.findById(createdBy);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found.',
            });
        }

        const newTodo = new todoModel({
            title,
            description,
            createdBy,
            completed: false,  
        });

        await newTodo.save();
        return res.status(201).json({
            success: true,
            message: 'To-Do created successfully!',
            todo: newTodo,
        });
    } catch (error) {
        console.error('Error creating To-Do:', error);
        return res.status(500).json({
            success: false,
            message: errorHandler(error),
        });
    }
};

module.exports.editTodo = async (req, res) => {
    const { id } = req.params;  
    const { title, description, completed } = req.body;
    const userId = req.user?.id; 

    try {
        const todo = await todoModel.findById(id);

        if (!todo) {
            return res.status(404).json({
                success: false,
                message: "To-Do not found.",
            });
        }
 
        if (todo.createdBy.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized: You can only edit your own To-Do items.",
            });
        } 

        todo.title = title || todo.title;
        todo.description = description || todo.description;
        if (completed !== undefined) {
            todo.completed = completed;
        }

        await todo.save();

        return res.status(200).json({
            success: true,
            message: "To-Do updated successfully!",
            todo,
        });
    } catch (error) {
        console.error("Error editing To-Do:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

module.exports.deleteTodo = async (req, res) => {
    const { id } = req.params; 
    const userId = req.user?.id; 

    try {
        const todo = await todoModel.findById(id);

        if (!todo) {
            return res.status(404).json({
                success: false,
                message: "To-Do not found.",
            });
        }
 
        if (todo.createdBy.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized: You can only delete your own To-Do items.",
            });
        }

        await todoModel.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "To-Do deleted successfully!",
        });
    } catch (error) {
        console.error("Error deleting To-Do:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

module.exports.getTodo = async (req, res) => {
    const { id } = req.params; 
    const userId = req.user?.id; 

    try {
        const todo = await todoModel.findById(id);

        if (!todo) {
            return res.status(404).json({
                success: false,
                message: "To-Do not found.",
            });
        }

        if (todo.createdBy.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized: You can only view your own To-Do items.",
            });
        }

        return res.status(200).json({
            success: true,
            todo,
        });
    } catch (error) {
        console.error("Error fetching To-Do:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

module.exports.getUserTodos = async (req, res) => {
    const userId = req.user?.id; 

    try {
        const todos = await todoModel.find({ createdBy: userId }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            todos,
        });
    } catch (error) {
        console.error("Error fetching user's To-Dos:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};
