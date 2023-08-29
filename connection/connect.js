const mongoose=require('mongoose');
mongoose.connect(process.env.CONNECTION).then(function(){
    console.log("Connection established");
}).catch((err)=>{
    console.log("no connection to database");
});
