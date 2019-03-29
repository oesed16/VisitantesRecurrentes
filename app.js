const express = require('express');
const app = express();
const mongoose = require("mongoose");

// Configuración
mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/mongo-2', { useNewUrlParser: true })
  .then(db => console.log('Db connected'))
  .catch(err => console.log(err));

app.set('view engine', 'ejs');

// Definición del Schema
const VisitorSchema = new mongoose.Schema({
  count: Number,
  name: String
});

// Definición del Modelo
const Visitor = mongoose.model("Visitor", VisitorSchema);

// RUtas y Lógica
app.get('/', async (req, res) => {
  const findName = await Visitor.find({ name: req.query.name });
  if (findName.length !== 0) {
    Visitor.updateOne (
      { name: req.query.name },
      { $inc: { count: 1 } },
      function(err,visitor) {
        if (err) return console.error(err);
        console.log('Updated');
      }
    );
  } else {
    const visitor = await Visitor.create({
      count: 1,
      name: req.query.name ? req.query.name : 'Anónimo'
    });
    console.log(visitor)
  }
  const listVisitors = await Visitor.find({});
  res.render('index', { visitors: listVisitors });
});

app.listen(3000, () => console.log('Listening on port 3000!'));