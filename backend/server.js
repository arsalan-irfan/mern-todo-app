const express=require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose=require('mongoose')
const todoRoutes=express.Router();
const PORT = 4000;
app.use(cors());
app.use(bodyParser.json());

let Todo=require('./todo.modal')

mongoose
.connect("mongodb://testuser:a1b2c3d4@ds161335.mlab.com:61335/todo_list_db")
.then(() => console.log("Connected to the DB"))
.catch(err => console.log("Error Occured while connecting to DB", err));

todoRoutes.route('/').get(function(req, res) {
    Todo.find(function(err, todos) {
        if (err) {
            console.log(err);
        } else {
            res.json(todos);
        }
    });
});
todoRoutes.route('/:id').get(function(req, res) {
    let id = req.params.id;
    Todo.findById(id, function(err, todo) {
        res.json(todo);
    });
});
todoRoutes.route('/update/:id').post(function(req, res) {
    Todo.findById(req.params.id, function(err, todo) {
        if (!todo)
            res.status(404).send("data is not found");
        else
            todo.todo_description = req.body.todo_description;
            todo.todo_responsible = req.body.todo_responsible;
            todo.todo_priority = req.body.todo_priority;
            todo.todo_completed = req.body.todo_completed;
            todo.save().then(todo => {
                res.json('Todo updated!');
            })
            .catch(err => {
                res.status(400).send("Update not possible");
            });
    });
});
todoRoutes.route('/add').post(function(req, res) {
    let todo = new Todo(req.body);
    todo.save()
        .then(todo => {
            res.status(200).json({'todo': 'todo added successfully'});
        })
        .catch(err => {
            res.status(400).send('adding new todo failed');
        });
});
app.use('/todos', todoRoutes);
app.listen(PORT, ()=> {
    console.log("Server is running on Port: " + PORT);
});
