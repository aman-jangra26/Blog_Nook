const express = require('express')
const app = express();
const cors =require('cors');
const { default: mongoose } = require('mongoose');
const User =require('./models/User');
const Post = require('./models/Post');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const  cookieParser =  require('cookie-parser');
const multer = require('multer');
const uploadMiddleware = multer({dest :'uploads/'});
const fs = require('fs');
require('dotenv').config();


const salt = bcrypt.genSaltSync(10);
const secret  = 'kjfbejajbgfiuwu392rjdvjsdgwrugvisjdnvlhg9r';   



const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});


const corsOptions = {
        credentials:true,
        origin: ['http://localhost:3000']
};

app.use(cors(corsOptions)); 
mongoose.connect(process.env.DB_URL)
app.use(express.json());
app.use(cookieParser());
// app.use('/uploads',express.static(__dirname + '/uploads'));


//for Register
app.post('/register', async(req,res)=>{
        const {username,password}=req.body;
       try{
        const UserDoc = await User.create({
                username,
                password:bcrypt.hashSync(password,salt)})
        res.json(UserDoc);
       }catch(e){
        res.status(400).json(e);
       }
}); 



//for login
app.post('/login', async(req,res)=>{
        const {username,password}=req.body;
        const UserDoc = await User.findOne({ username});
        const passok = bcrypt.compareSync(password,UserDoc.password);
        // res.json(passok);
        if(passok){
                jwt.sign({username,id:UserDoc._id},secret, {}, (err,token)=>{
                        if(err) throw err;
                        res.cookie('token',token).json({
                                id:UserDoc._id,
                                username,
                        });
                });
        }else{
                res.status(400).json('wrong credentials');
        }
}); 
app.get('/profile',(req,res) =>{
        const {token} = req.cookies;
        jwt.verify(token,secret,{}, (err,info)=>{
                if(err) throw err;
                res.json(info);
        });
        
});

app.post('/logout',(req,res) => {
        res.cookie('token','').json('ok');
});


app.post('/post', uploadMiddleware.single('file'), async (req, res) => {
        const { originalname, path } = req.file;
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        const newPath = path + '.' + ext;
        fs.renameSync(path, newPath);
      
        const { token } = req.cookies;
        jwt.verify(token, secret, {}, async (err, info) => {
          if (err) throw err;
          const { title, summary, content } = req.body;
      
          try {
            // Upload the image to Cloudinary
            const cloudinaryResponse = await cloudinary.uploader.upload(newPath, {
              folder: 'blog_images', // Specify the folder in Cloudinary where you want to save the image
            });
      
            const PostDoc = await Post.create({
              title,
              summary,
              content,
              cover: cloudinaryResponse.secure_url, // Save the secure URL of the uploaded image
              author: info.id,
            });
      
            res.json(PostDoc.cover);
          } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to upload the image to Cloudinary' });
          }
        });
      });

app.put('/post', uploadMiddleware.single('file'), async (req, res) => {
        let newPath = null;
        if (req.file) {
          const { originalname, path } = req.file;
          const parts = originalname.split('.');
          const ext = parts[parts.length - 1];
          newPath = path + '.' + ext;
          fs.renameSync(path, newPath);
        }
      
        const { token } = req.cookies;
        jwt.verify(token, secret, {}, async (err, info) => {
          if (err) throw err;
          const { id, title, summary, content } = req.body;
          const postDoc = await Post.findById(id);
          const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
          if (!isAuthor) {
            return res.status(400).json('you are not the author');
          }
      
          try {
            let coverUrl = newPath ? postDoc.cover : postDoc.cover;
            if (newPath) {
              // Upload the updated image to Cloudinary
              const cloudinaryResponse = await cloudinary.uploader.upload(newPath, {
                folder: 'blog_images',
              });
              coverUrl = cloudinaryResponse.secure_url;
            }
      
            await postDoc.updateOne({
              title,
              summary,
              content,
              cover: coverUrl, // Update the secure URL of the image
            });
      
            res.json(postDoc);
          } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to upload the image to Cloudinary' });
          }
        });
      });
      


app.get('/post', async (req,res) => {
        res.json(
          await Post.find()
            .populate('author', ['username'])
            .sort({createdAt: -1})
            .limit(20)
        );
      });


app.get('/post/:id', async (req,res)=>{
        const {id,author} = req.params;
        const  postDoc = await  Post.findById(id).populate('author',['username']);
        res.json(postDoc);
})
app.listen(process.env.PORT);
//mongodb+srv://blogit:XbxGk2uinecT3NUI@blogcluster0.idzmzcj.mongodb.net/?retryWrites=true&w=majority