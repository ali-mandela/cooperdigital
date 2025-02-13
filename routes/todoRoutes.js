const express = require('express'); 
const { 
    createTodo, 
    deleteTodo, 
    editTodo, 
    getTodo, 
    getUserTodos 
} = require('../controllers/todoController');
const { verifyToken } = require('../config/util');

const router = express.Router();

router.post('/create', verifyToken, createTodo);
router.put('/edit/:id', verifyToken, editTodo);
router.delete('/delete/:id', verifyToken, deleteTodo);
router.get('/todo/:id', verifyToken, getTodo);
router.get('/all-todos', verifyToken, getUserTodos);

module.exports = router;
