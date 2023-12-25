const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const cors = require('cors');
const indexRouter = require('./routers/index');
const app = express();

require('dotenv');
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

app.use('/api', indexRouter);

const mongoURI = process.env.LOCAL_DB_ADDRESS
mongoose
  .connect(mongoURI)
  .then(() => console.log("mongoose connected"))
  .catch((error) => console.log("DB connection fail", error));

app.listen(process.env.PORT || 5050, () => {
    console.log('server on');
});