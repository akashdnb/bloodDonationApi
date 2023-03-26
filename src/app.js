const express = require('express');
const donar = require('./models/donar.js');
const app= express();
const donarRouter = require('./routers/donarRouter');
const cors = require('cors');
const cron = require('node-cron');
require('./db/conn.js');
var request = require('request');
const port= process.env.POST || 3000;

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
//app.use(cors)
app.use(donarRouter);


app.listen(port, ()=>{
    console.log(`Listining to port: ${port}`);
})


//for other app

cron.schedule('*/2 * * * *', () => {
  //console.log('running a task every two minutes');
  try {
    request.get('https://inductions2022.onrender.com/test', (erroe, response, body)=>{
      console.log(body);
    });
  } catch (error) {
    console.log(error);
  }
});

//900000 means 15 Minutes 