const mongoose = require('mongoose');
const  atlasUri ='mongodb+srv://akash:jamshedpur@cluster0.cjb8vpc.mongodb.net/DonarDB?retryWrites=true&w=majority';

    mongoose.connect(atlasUri,{
      useNewUrlParser: true,
      useUnifiedTopology: true,
     }).then(()=>{
      console.log('connected to database!!')
     }).catch((e)=>{
      console.log(`No connection ${e}`)
     });
     