const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
//port
const port = 3000;

//initialize app
const app = express();

//connecting using mongodb driver(note:its nt d best way,buh its a basic way to start.)
const  MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const url = 'mongodb://localhost:27017/todoapp';

//body parser midddleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extented: false}));
app.use(express.static(path.join(__dirname, 'public')));

//view setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//connect to mongodb
MongoClient.connect(url,(err, database) => {
console.log('MongoDB connected.....');
if(err)throw err;

db = database;
Todos = db.collection('todos');

app.listen(port, ()=>{
    console.log('server listening on port '+port);
});
});

app.get('/', (req,res,next)=>{
    Todos.find({}).toArray((err, todos)=>{
       if(err) {
           return console.log(err);
       }
        res.render('index',{
         todos:todos  
       });
     });
});

app.post('/todo/add',(req,res, next)=>{
  //create todo
  const todo={
      text: req.body.text,
      body: req.body.body
  }
  //insert todo
  Todos.insert(todo, (err, result)=>{
if(err){
    return console.log(err);
}
console.log('Todo Added...');
res.redirect('/');
  });
});

app.delete('/todo/delete/:id',(req, res, next)=>{
const query ={_id:ObjectID(req.params.id)}
Todos.deleteOne(query,(err, response)=>{
if(err){
    return console.log(err);
}
console.log('Todo removed');
res.send(200);
});
});

app.get('/todo/edit/:id', (req, res, next) => {
    const query = {_id: ObjectID(req.params.id)}
    Todos.find(query).next((err, todo) => {
      if(err){
        return console.log(err);
      }
      res.render('edit',{
        todo: todo
      });
    });
  });


app.post('/todo/edit/:id', (req, res, next) => {
    const query = {_id: ObjectID(req.params.id)}
    // Create todo
    const todo = {
      text: req.body.text,
      body: req.body.body
    }
  
    // Update todo
    Todos.updateOne(query, {$set:todo}, (err, result) => {
      if(err){
        return console.log(err);
      }
      console.log('Todo Updated...');
      res.redirect('/');
    });
  });
