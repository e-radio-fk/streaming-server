//
// This is site's main
//

var express = require('express');

const app = express();

app.use(express.static(__dirname + '/docs'));

app.get('/', (req, res) => {
  res.sendFile('index.html');
});
 
app.listen(3000, () =>
  console.log('Example app listening on port 3000!'),
);