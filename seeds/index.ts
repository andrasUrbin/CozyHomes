export {};

const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const CozyHome = require('../models/cozyhome');

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

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await CozyHome.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const home = new CozyHome({
      location: `${cities[random].city}, ${cities[random].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      image: 'https://source.unsplash.com/collection/1118894',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus quo odit numquam incidunt eius porro vero id pariatur earum, perspiciatis impedit a voluptate quae non enim, omnis consequuntur assumenda eaque.',
      price,
    });
    await home.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
