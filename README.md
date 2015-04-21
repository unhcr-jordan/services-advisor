This build uses npm, gulp, and browserify to manage dependencies.

To install gulp:
- run "npm install -g gulp"

To build the build:
- run "npm install" to download the 3rd party libs in package.json
- run "gulp" to browserify them (ie, to create the minified, namespace-armored js/app.js file).

To run the project:
- run "npm install -g http-server"
- run "http-server"
- go to "http://localhost:8080"
- in the future, since you've already installed http-server you can just run "http-server"

DEVELOPING

While developing, run gulp in the background - ie, run "gulp" in a terminal and
leave it running.  It will automatically recompile app.js as you edit the src files.


Files:

- LICENSE.txt - the MIT license
- README.md - this help file
- crossdomain.xml
- css/
  - images/ - contains the marker image files for AwesomeMarkers
  - leaflet.awesome-markers.css - CSS for AwesomeMarkers Leaflet plugin
  - normalize.css - cross-browser CSS, derived from HTML5 Boilerplate
  - main.css - the single CSS file that the browser uses, compiled from the SASS files in scss/
- gulpfile.js - the gulp file.  This file tells gulp how to compile app.js from the various libraries and src files.
- humanfont/ - HumanitarianFont, the font we use for the markers.
- humans.txt - the credits.  Add yourself!
- index.html - the sole HTML file that serves to convey all of this JS
- js/app.js - the single JS file that the browser uses, compiled from the other JS files and libraries
- js/app.min.js - minified version of the js/app.js. Please make sure you run gulp task while making changes to the code
- node-modules/ - the libraries that are installed by npm.  If the build has run successfully, this folder should contain:
   - crossfilter
   - gulp
   - gulp-sas
   - gulp-util
   - jquery
   - leaflet
   - leaflet.markercluster
   - mapbox.js
   - split
   - vinyl-source-stream
   - watchify

# How Services Data Is Loaded and Translated
- `cat src/sources.txt | src/getJSON.js`
  - this will call all the urls in `sources.txt` and then concatenate all the json responses into `compiled.json`
  - NOTE: right now all those urls 500
- `node src/LoadJSON.js`
  - this takes the json from `compiled.json` and removes all the `comments` fields (which aren't translated) to output `compileTruncated.json`
- `node src/ParseEn_AR_JSON.js`
  - uses `data.csv` to regex replace the English strings in `compileTruncated.json` with their Arabic translations. This outputs `compiled_AR.json`.

## Arabic Site (http://data.unhcr.org/jordan/services-advisor/index_AR.html)
- uses a modified `index.html` with Arabic translations
- this in turn requires `app_AR.js` instead of `app.js`
- `app_AR.js` loads `compiled_AR.json`
