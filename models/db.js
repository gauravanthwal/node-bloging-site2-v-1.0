const mongoose = require('mongoose')

mongoose.connect(process.env.DATABASE_URL,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  }).then(()=>{
      console.log('db connected');
  }).catch((err)=>{
      console.log(err);
  })