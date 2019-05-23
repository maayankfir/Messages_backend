const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors');
const knex = require('knex')

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : '',
    password : '',
    database : 'wonder_q'
  }
});
//
// db.select('*').from('messages').then( data => {
//   console.log(data);
// })

const app = express();

app.use(bodyParser.json());
app.use(cors())


app.get('/messages', (req, res) => {
  db.select('*').from('messages').then( data => {
    res.send(data)
  })
});

app.get('/messages/active', (req, res) => {
  db.select('*').from('messages').where('isactive', '=', true).then( data => {
    res.send(data)
  })
});

app.post('/messages', (req, res) => {
  const {isactive, messageinput} = req.body;
  db('messages')
  .returning('*')
  .insert({
    messageinput: messageinput,
    created: new Date()
  }).then(message => {
    res.json(message)
  }).catch(err=> res.status(400).json(err))
})

app.get('/messages/:id', (req, res) => {
  const { id } = req.params;
  db.select('*').from('messages').where({id})
  .then(message => {
    res.json(message[0]);
  })
})

app.listen(3000, () => {
  console.log('app is running on port 3000');
});

/*
  /--> res = this is working
  /new Message --> POST = success/failed
  /messages --> GET
  /messages/:id --> GET
  /messages/:id --> POST = success/back to DB
  /messages/:id - if success --> DELETE
*/
