const express=require("express");
const app=new express();
const port = process.env.PORT ||5100;


const nav=[
    {link:'/home',name:'Home'},
    {link:'/books',name:'Books'},
    {link:'/authors',name:'Authors'},
    {link:'/addbook',name:'Add Book'},
   {link:'/addauthor',name:'Add Author'},
   {link:'/logout',name:'Log Out'},
   
//    {link:'/login',name:'Log In'}
];

const BooksRouter=require('./src/routes/bookRoutes')(nav);
const AuthorsRouter=require('./src/routes/authorRoutes')(nav);
const addbookRouter = require('./src/routes/addbookRoutes')(nav);
const addauthorRouter =require('./src/routes/addauthorRoutes')(nav);
const loginRouter =require('./src/routes/loginRoutes')(nav);
// const signupRouter=require('./src/routes/signupRoutes')(nav);

app.use(express.static('./public'));
app.set('view engine','ejs');
app.set('views','./src/views');

// app.use('/signup',signupRouter);
app.use('/login',loginRouter);
app.use('/books',BooksRouter);
app.use('/authors',AuthorsRouter);
app.use('/addbook',addbookRouter);
app.use('/addauthor',addauthorRouter);





////////////ode mailer
var nodemailer = require('nodemailer');
// const express = require('express')
const bodyParser = require('body-parser');
const fs = require('fs')
const multer = require('multer');
const { getMaxListeners } = require('process');
// const app = express()
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static('public'))
// app.use(bodyParser.json())
const alert = require('alert'); 
const { DH_UNABLE_TO_CHECK_GENERATOR } = require("constants");

var to;
var subject;
var body;
var path

var Storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, "./images");
    },
    filename: function(req, file, callback) {
        callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
        console.log(Date.now)
    }
});

var upload = multer({
    storage: Storage
}).single("image"); //Field name and max count


app.post('/sendemail',(req,res) => {
    upload(req,res,function(err){
        if(err){
            console.log(err)
            return res.end("Something went wrong!");
        }else{
            to = req.body.to
            subject = req.body.subject
            body = req.body.subject
            //  path = req.file.path
            console.log(to)
            console.log(subject)
            console.log(body)
            // console.log(req.file)
           //// console.log(req.files)
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: 'sendwishtodears@gmail.com',
                  pass: 'sendwish@2'
                }
              });
              
              var mailOptions = {
                from: 'sendwishtodears@gmail.com',
                to: to,
                subject:subject,
                html: 'Rejoice on this blessed occasion by spreading joy with your family and friends. Wish you all a Happy Diwali & a prosperous year ahead!!!: <img src="cid:unique@nodemailer.com"/>',
                attachments: [
                  {
                   
                   filename: 'teahub.io-diwali-wallpaper-110465.png',
                   path:'https://www.teahub.io/photos/full/11-110465_diwali-wallpapers-diwali-pictures-wallpapers-of-diwali-wallpapers..jpg',
			       cid: 'unique@nodemailer.com'
                  }
               ]
              };
              
              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                    // alert("Awsome!!!Your wish reached there.Send another wish here....");
                    return res.redirect('/new')
                //    console.log('Email sent: ' + info.response);
                  fs.unlink(path,function(err){
                    if(err){
                        return res.end(err)
                    }else{
                        console.log("deleted")
                        return res.redirect('/login')
                    }
                  })
                }
              });
        }
    })
})






























app.get('/new',function(req,res){
    res.render("new")
});




app.get('/',function(req,res){
    res.render("login",
    {
        nav,
        title:'Library'});
});
app.get('/logout',function(req,res){
    res.render("login",
    {
        nav,
        title:'Library'});
});
app.get('/home',function(req,res){
    res.render("index",
    {
        nav,
        title:'Library'});
});
app.listen(port,()=>{console.log("Server Ready at"+port)});