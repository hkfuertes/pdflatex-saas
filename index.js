var express = require('express')
, request = require('request')
, fs   = require('fs')
, tmp  = require('tmp')
, exec = require('child_process').exec
, path = require('path')
;
const app = express()

function getReceivedStream(req,res, recfilepath){
  received = fs.createWriteStream(recfilepath);
  received.on('close', function () {
      var dir      = path.dirname(recfilepath)
        , basename = path.basename(recfilepath).replace('.tmp','')
        ;
      exec('pdflatex -interaction=batchmode -output-directory=' + dir + ' ' + recfilepath, function (err, stdout, stderr) {
        if(err || stderr) {
          console.log('!' + recfilepath);
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end(err && err.message || stderr);
          return;
        }

        //Adjust headers
        //res.setHeader('Content-Disposition', 'attachment; filename=' + "document.pdf");
        //res.setHeader('Content-Transfer-Encoding', 'binary');
        //res.setHeader('Content-Type', 'application/pdf');
        res.download(path.join(dir, basename)+".pdf",'document.pdf');
        //res.sendFile(path.join(dir, basename)+".pdf");
      });

  })
  return received;
}

app.get('/', function (req, res){
  var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  retVal = {
    'Welcome':'Hello! to the PDFLaTeX Service, only 2 routes are available.',
    'Routes':{
      '/url?url=':{
        'Info':'GET route, send the url to the latex file, it must be public.',
        'Example': fullUrl+'url?url=https://production-overleaf-static.s3.amazonaws.com/examples/helloworld.tex'
      },
      '/binary':{
        'Info':'POST route, send the the file as binary body',
        'Example': 'Using cURL: curl '+fullUrl+'binary --data-binary @my.tex > my.pdf'
      }
    }
  }
  res.send(retVal)
})

// http://localhost:5050/url?url=http://csbruno.herokuapp.com/mass/tex/5
app.get('/url', function(req,res){
  tmp.file(function (err, recfilepath) {
    received = getReceivedStream(req,res,recfilepath)
    request(req.query['url']).pipe(received)
  })
})

// curl your-docker-machine:5050/binary --data-binary @my.tex > my.pdf
app.post('/binary', function(req,res){
    tmp.file(function (err, recfilepath) {
      received = getReceivedStream(req,res,recfilepath)
      req.pipe(received);
    });
})

var server_port = process.env.YOUR_PORT || process.env.PORT || 5050;
app.listen(server_port)