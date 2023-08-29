const mongoose=require('mongoose');

const urlSchema = new mongoose.Schema({
    originalURL:{
        type:String,
        required:true
    },
    shortURL:{
        type:String,
        required:true
    },
    click:{
        type:Number,
        default:0
    }
});

const Url= mongoose.model('Url',urlSchema);
module.exports=Url;