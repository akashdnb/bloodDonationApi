
const express= require('express');
const router= express.Router();
const Donar = require('../models/donar.js');
const bcrypt = require("bcryptjs"); 
const jwt = require("jsonwebtoken");
const isLoggedIn = require('../middlewares/auth');
const { query } = require('express');
require("dotenv").config(); 

var group={
    Aplus:"A+",
    Aminus:"A-",
    Bplus:"B+",
    Bminus:"B+",
    ABplus:"AB+",
    ABminus:"AB+",
    Oplus:"O+",
    Ominus:"O-",
    Atwoplus:"A2+",
    Atwominus:"A2-",
    AoneBplus:"A1B+",
    AoneBminus:"A1B-",
    AtwoBplus:"A2B+",
    AtwoBminus:"A2B-"
}

const { SECRET = "secret" } = process.env;

router.get('/', async (req,res)=>{
    try{
        const donarData= await Donar.find({availability:true});
        if(!donarData){
            res.status(404).send('No donar available');
        }
        else res.send(donarData);
    }catch(e){
        res.status(404).send(`Not Found!! ${e}`);
     }
})

 let counter=100;

//get data by district 
router.get('/donars', async(req,res)=>{
     let query={
        "availability" : true
    }
    if(req.query.bloodGroup){
        query.bloodGroup=group[req.query.bloodGroup];
    }
    if(req.query.district){
        query.district=req.query.district;
    }
    let page = 0;
    let itemsPerPage = 30;
    if(req.query.page){
        page=req.query.page
    }
    if(req.query.itemsPerPage){
        page=req.query.itemsPerPage
    }
    try{
        const donarData= await Donar.find(query).skip(page * itemsPerPage).limit(itemsPerPage);
        if(!donarData){
            res.status(404).send('No donar available');
        }
        else res.send(donarData);
    }catch(e){
        res.status(404).send(`Not Found!! ${e}`);
     }
})

// get individual data
router.get('/donar/:id', async(req,res)=>{
    try{
        const _id= req.params.id;
        const donar= await Donar.findById(_id);

        if(!donar){
            res.status(404).send();
        }else{
            res.send(donar);
        }
    }catch(e){
        res.status(500).send(e);
    }
})

//get data count
router.get('/count', async(req,res)=>{
    let query={
        "availability" : true
    }
    if(req.query.bloodGroup){
        query.bloodGroup=group[req.query.bloodGroup];
    }
    if(req.query.district){
        query.district=req.query.district;
    }
       let counter= await Donar.count(query,(err, ctr)=>{
              if(err) throw err
              else{
                res.send({counter: ctr})
              }
        }).clone().catch((err)=>{
            res.status(404).send({counter: ctr})
        });
});


//delete student
router.delete('/donar/:id',isLoggedIn, async(req,res)=>{
    try{
        const deleteDonar= await Donar.findByIdAndDelete(req.params.id);

        if(!deleteDonar){
            res.status(404).send();
        }else{
            res.send(`Donar deleted`);
        }
    }catch(e){
        res.status(500).send(e);
    }
})

//update student by id
router.patch('/donar/:id',isLoggedIn, async(req,res)=>{
    try{
        const _id= req.params.id;
        if(req.body.password){
            req.body.password = await bcrypt.hash(req.body.password, 10);
        }
        const updateDonar= await Donar.findByIdAndUpdate(_id,req.body);
        if(!updateDonar){
            res.status(404).send();
        }else{
            res.send(`Donar updated`);
        }
    }catch(e){
        res.status(500).send(e);
    }
})


//signup by user
router.post("/signup", async (req, res) => {
    try {
      const donar= new Donar(req.body);
      donar.password = await bcrypt.hash(req.body.password, 10);
      const createDonar= await donar.save();
      if(createDonar){
        const token = await jwt.sign({ email: donar.email }, SECRET);
          res.status(200).send({token, createDonar})
      }
      }catch(e){
      res.status(400).send(e)
      } 
  });

  //login by user
  router.post("/login", async (req, res) => {
    try {
      const donar = await Donar.findOne({ email: req.body.email });
      if (donar) {
        const result = await bcrypt.compare(req.body.password, donar.password);
        if (result) {
          const token = await jwt.sign({ email: donar.email }, SECRET);
          res.status(200).send({token, donar})
        } else {
          res.status(400).json({ error: "password doesn't match" });
        }
      } else {
        res.status(400).json({ error: "Doner doesn't exist" });
      }
    } catch (error) {
      res.status(404).json({ error });
    }
  });
  
  module.exports = router
