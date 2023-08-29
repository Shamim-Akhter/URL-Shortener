const express= require('express');
const bodyParser=require('body-parser');
const dns= require('dns');
const cors=require('cors');
require('dotenv').config();
const connection=require('./connection/connect.js');
const uuid = require('uuid');
const app=express();
app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));
const Url = require('./model/schema.js');
app.use(express.static('public'));
const port=process.env.PORT || 8000;
app.get('/',function(req,res){
    res.sendFile(__dirname+"/views/index.html");
});

app.post('/api/shorturl',function(req,res){
    const url=req.body.url;
    dns.lookup(url, async (err,address)=>{
        if(err){
            res.status(200).json({"error":"Invalid URL"});
        }
        else{
                try{
                    const urlFind = await Url.find({originalURL:url});
                    if(urlFind.length>0){
                        res.status(200).json({
                            "original_url":urlFind[0].originalURL,
                            "short_url":urlFind[0].shortURL
                        });
                    }
                    else{
                         const uniqueId= uuid.v4();
                         const createdData = await Url.create({
                            originalURL:url,
                            shortURL:uniqueId
                         });

                         res.status(201).json({
                            "original_url":createdData.originalURL,
                            "short_url":createdData.shortURL
                         });
                    }
                }
                catch(err){
                    console.log(err);
                }
        }
    });
});

app.get('/api/shorturl/:url',async function(req,res){
    try{
         const url=req.params.url;
         const urlFind= await Url.find({shortURL:url});
         if(urlFind.length>0){
              const originalURL= urlFind[0].originalURL;
              const address= `https://${originalURL}`;
              res.status(302).redirect(address);
         }
         else{
            console.log(urlFind);
            res.status(200).json({
                "error":"No short URL found for the given input"
            })
         }
    }
    catch(err){
        res.status(400).send(err);
    }
})



app.listen(port,()=>{
    console.log(`Server is listening on port ${port}`,);
});