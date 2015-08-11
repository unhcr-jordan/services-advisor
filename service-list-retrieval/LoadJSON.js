var fs = require('fs');

// Truncate Comments from compile.json file
var json = require('./services.json');
for (var i = 0; i < json.length; i++) {
    delete json[i].properties.comments;
}
var newJson = json;

var outputFilename = '../js/services_EN.json';

fs.writeFile(outputFilename, JSON.stringify(newJson), function (err) {
    if (err) {
        console.log(err);
    }
}); 

