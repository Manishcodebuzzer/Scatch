const express=require("express");
const router=express.Router();

router.get("/",(req,res)=>{
   res.send("Hii i am Products")
});

module.exports=router;