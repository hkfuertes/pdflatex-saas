# pdflatex as a service [Music Sheet Edition]

LaTeX Goes In, PDF is Streamed Out, with added libraries *texlive-music* and *texlive-lang-spanish*

Remade using express.js

```javascript
{
    'Welcome':'Hello! to the PDFLaTeX Service, only 2 routes are available, "/url?url=" and "/binary"',
    'Routes':{
      '/url?url=':{
        'Info':'GET route, send the url to the latex file, it must be public.',
        'Example': '<docker_conainer>/url?url=https://production-overleaf-static.s3.amazonaws.com/examples/helloworld.tex'
      },
      '/binary':{
        'Info':'POST route, send the the file as binary body',
        'Example': 'Using cURL: curl <docker_conainer>/binary --data-binary @my.tex > my.pdf'
      }
    }
  }
```
