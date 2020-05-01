const { spawn } = require('child_process');
var express = require('express');
var app = express();
var multer = require('multer')
var cors = require('cors');
app.use(cors())
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
})

var upload = multer({ storage: storage }).array('file')

app.get('/', function (req, res) {
  console.log('Server is up and running')

})

const PathName = (path) => {
  console.log(path)
}
app.post('/upload', function (req, res) {

  upload(req, res, function (err) {

    if (err instanceof multer.MulterError) {
      return res.status(500).json(err)
      // A Multer error occurred when uploading.
    } else if (err) {
      return res.status(500).json(err)
      // An unknown error occurred when uploading.
    }
    const python = spawn('python3', ['../cm.py', req.files[0].path]);
    python.stdout.on('data', async function (data) {
      console.log('Pipe data from python script ...');
      dataToSend = await data.toString();
    });
    python.on('close', (code) => {
      console.log(`child process close all stdio with code ${code}`);
      // send data to browser
      return res.status(200).send(dataToSend)
    });


    // console.log(req.files[0].path)

    // Everything went fine.
  })
});

app.listen(8000, function () {
  console.log('App running on port 8000');
});