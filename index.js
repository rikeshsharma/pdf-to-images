const path = require('path');
const multer = require('multer');
const express = require('express');
const {exec} = require('child_process');
const bodyParser = require('body-parser');

const app = express();

//make the uploads directory as static can be done as follows
app.use(express.static(path.join(__dirname +'/uploads')));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


//to upload we have to configure multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
  });

const upload = multer({storage:storage}).single('file');


app.get('/', (req, res)=>{
    res.sendFile(__dirname+'/'+'index.html');
})

app.post('/converttoimage', (req, res)=>{
    //first upload the PDF
    upload(req, res, (error)=>{
        if(error){
            console.error(error);
        }
        else{
            console.log(req.file.path);
            exec(`convert ${req.file.path} -quality 100 output-%3d.jpg`,(error, stdout,  stderr)=>{
                if(error){
                    console.error(error);
                    res.sendFile(__dirname+ '/failure.html');
                }
                else{
                    console.log("Conversion Completed")
                    res.sendFile(__dirname +'/success.html');
                }
            });
        }
    })
});


app.listen(5000, ()=>{
    console.log("App is listening on port 5000")
})