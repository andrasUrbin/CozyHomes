export {};

const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const CozyHome = require('./models/cozyhome');

mongoose.connect('mongodb://localhost:27017/cozyhomes', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
  console.log('Database connected');
});

app.set('view engine', 'ejs');
app.set('vies', path.join(__dirname, 'views'));

app.engine('ejs', ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/cozyhomes', async (req, res) => {
  const cozyhomes = await CozyHome.find({});
  res.render('cozyhomes/index', { cozyhomes });
});

app.get('/cozyhomes/new', (req, res) => {
  res.render('cozyhomes/new');
});

app.post('/cozyhomes', async (req, res) => {
  const cozyhome = new CozyHome(req.body.cozyhome);
  await cozyhome.save();
  res.redirect(`/cozyhomes/${cozyhome._id}`);
});

app.get('/cozyhomes/:id', async (req, res) => {
  const cozyhome = await CozyHome.findById(req.params.id);
  res.render('cozyhomes/show', { cozyhome });
});

app.get('/cozyhomes/:id/edit', async (req, res) => {
  const cozyhome = await CozyHome.findById(req.params.id);
  res.render('cozyhomes/edit', { cozyhome });
});

app.put('/cozyhomes/:id', async (req, res) => {
  const { id } = req.params;
  const cozyhome = await CozyHome.findByIdAndUpdate(id, {
    ...req.body.cozyhome,
  });
  res.redirect(`/cozyhomes/${cozyhome._id}`);
});

app.delete('/cozyhomes/:id', async (req, res) => {
  const { id } = req.params;
  await CozyHome.findByIdAndDelete(id);
  res.redirect('/cozyhomes');
});

app.listen(3000, () => {
  console.log('Serving on port 3000');
});
