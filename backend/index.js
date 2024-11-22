const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const { log } = require("console");
const jwt = require("jsonwebtoken");

// Encoding the password to handle special characters
const password = encodeURIComponent("Hois@2024");
const uri = `mongodb+srv://hosnyish:${password}@cluster0.ebp3r.mongodb.net/e-commerce`;

app.use(express.json());
app.use(cors());

// Database connection with mongoose
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

app.get("/", (req, res) => {
  res.send("Express app is running");
});

const storage = multer.diskStorage({
  destination: "./upload/images",
  filename: (req, file, cb) => {
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage: storage });

// creating upload endpoint images

app.use("/images", express.static("upload/images"));

app.post("/upload", upload.single("product"), (req, res) => {
  res.json({
    success: 1,
    image_url: `http://localhost:${port}/images/${req.file.filename}`,
  });
});

//add schema to database

const Product = mongoose.model("Product", {
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },

  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  new_price: {
    type: Number,
    required: true,
  },
  old_price: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  available: {
    type: Boolean,
    default: true,
  },
});
//add product to database
app.post("/addproduct", async (req, res) => {
    let products =await Product.find({});
    let id;
    if(products.length > 0){
        let l_product_a=products.slice(-1);
        let l_product =l_product_a[0];
        id =l_product.id+1
    }else{
        id=1;
    }
  const product = new Product({
    id: id,
    name: req.body.name,
    image: req.body.image,
    category: req.body.category,
    new_price: req.body.new_price,
    old_price: req.body.old_price,
    date: req.body.date,
    available: req.body.available,
  });
  console.log(product);
  await product.save();
  console.log("Product saved");
  res.json({
    success: true,
    name: req.body.name,
  })
});


//Delete product from store

app.post('/deleteproduct',async(req,res)=>{
    await Product.findOneAndDelete({id:req.body.id})
    console.log("Product deleted");
    res.json({
        success: true,
        name:req.body.name
    })
})

//Get All Products 

app.get('/getallproducts',async(req,res)=>{
  
    let data = await Product.find({});
    console.log("Get all products");
    res.send(data)

})

//get new collections
app.get('/getnewcollections',async(req,res)=>{
  let products =await Product.find({})
  let newCollections=products.slice(1).slice(-8);
  console.log("new collections Fetched");
  res.send(newCollections);

})

//get poplar in women section
app.get('/getpoplarinwomen',async(req,res)=>{
  let products =await Product.find({category:"women"})
  let popularWomen = products.slice(0,4)
  res.send(popularWomen);


})

//shema creating for user model

const Users = mongoose.model('Users',{
  name:{
     type: String,

  },
  email:{
     type: String,
     unique: true,

  },
  password:{
    type: String,

  },
  cartData:{
    type: Object,
  },
  date:{
    type: Date,
    default: Date.now,
  }

});

app.post('/signup',async(req,res)=>{

  let check =await Users.findOne({email:req.body.email});
  
  if(check){
    return res.status(400).json({success:false,
      error:"existing user found with same email "})
  }
  let cart={}
  for(let i=0 ; i<300;i++){
    cart[0]=0;
  }

  const user =new Users({
    name:req.body.username,
    email:req.body.email,
    password:req.body.password,
    cartData:cart,
  })

await user.save();
const data ={
  user:{
    id:user.id
  }
}

const token = jwt.sign(data,'secret_ecom')
res.json({success:true,token})


})

app.post('/login',async(req,res)=>{
  let user = await Users.findOne({email:req.body.email})
  if(user){
    let passComp=req.body.password===user.password;
    if(passComp){
      const data={
        user:{
          id:user.id,

        }
      }

      const token = jwt.sign(data,'secret_ecom');

    res.json({success:true,token})

    }else{
      res.json({success:false,error:"Password is incorrect"})
    }
  }else{
    res.json({success:false,error:"Email is invalid"})
  }
})





app.listen(port, (error) => {
  if (!error) {
    console.log("Server running on port " + port);
  } else {
    console.log("Error: " + error);
  }
});

//creating middleware for fetch user
const fetchUser=async(req,res,next)=>{
  const token = req.header('auth-token');
  if(!token){
    res.status(401).send({error:"please authenticate useing valid token"})
    
  }else{
    try{
      const data=jwt.verify(token,"secret_ecom");
      req.user=data.user;
      next();
    }catch(e){
      res.status(401).send({error:"please authenticate useing valid token"})
    }
  }


}
// endpoint adding product to cart
app.post('/addtocart',fetchUser, (req, res) => {
  console.log(req.body,req.user);

})
