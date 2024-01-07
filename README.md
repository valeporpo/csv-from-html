# csv-from-html
This library allows you to generate and download csv files containing the text inside HTML elements
(technicallys speaking, the [innerText](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/innerText) property of the elements).
For example, starting from
```html
<div class="csv-from-html-table">
  <div class="csv-from-html-row">
    <div class="csv-from-html-cell">Donec condimentum</div>
    <div class="csv-from-html-cell">ligula sed maximus sagittis</div>
    <div class="csv-from-html-cell">Maecenas non auctor libero</div>
  </div>
  <div class="csv-from-html-row">
    <div class="csv-from-html-cell">Aliquam pellentesque leo et faucibus</div>
    <div class="csv-from-html-cell">Pellentesque varius</div>
    <div class="csv-from-html-cell">risus non ornare dapibus</div>
  </div>
  <div class="csv-from-html-row">
    <div class="csv-from-html-cell">Nullam tincidunt metus diam</div>
    <div class="csv-from-html-cell">et luctus ante vulputate vitae</div>
    <div class="csv-from-html-cell">Pellentesque commodo nisi metus</div>
  </div>
  <div class="csv-from-html-row">
    <div class="csv-from-html-cell">quis bibendum purus</div>
    <div class="csv-from-html-cell">finibus molestie</div>
    <div class="csv-from-html-cell">Lorem ipsum dolor sit amet</div>
  </div>
</div>

```
it will produce a csv file like this:
. | A | B | C |
--- | --- | --- | --- |
1 | Donec condimentum | ligula sed maximus sagittis | Maecenas non auctor libero |
2 | Aliquam pellentesque leo et faucibus | Pellentesque varius | risus non ornare dapibus |
3 | Nullam tincidunt metus diam | et luctus ante vulputate vitae | Pellentesque commodo nisi metus |
4 | quis bibendum purus | finibus molestie | Lorem ipsum dolor sit amet |

Given an HTML structure like the one shown above, which is organized as a table without being (necessarily) an HTML ```<table>```, once you have defined CSS selectors to identify an external wrapper (in the example, ```.csv-from-html-table```) the "rows" (```.csv-from-html-row```) and "cells" within them (```.csv-from-html-cell```), you will be able to generate a csv file containing its innerText organized exactly _as it is_ in the HTML structure.
Every "row" element constitute a row in the csv, and every "cell" element constitute a cell inside a row.

## Installation
The installation command is
```
npm install csv-from-html
```

## Import
Since this package is intended to run in the browser, you have to include it using a ```<script>``` tag in your html file. You have three options to do that.

### A) Using a CDN (![#1589F0](https://via.placeholder.com/15/1589F0/000000?text=+) the easiest way)
Just include this tag in your html:
```html
<script src="https://unpkg.com/csv-from-html@2.0.2/dist/main.umd.min.js"></script>
```
### B) Using a module boundler (![#c5f015](https://via.placeholder.com/15/c5f015/000000?text=+) the recommended way)
I'll give you an example of doing this with [webpack](https://webpack.js.org/). 
1. Create a JS file in your project, for example './src/index.js', where you import the ```CsvFromHtml``` class and write the code to generate your csv file:
```javascript
import CsvFromHtml from 'csv-from-html'
    
const csv = new CsvFromHtml({
  // This is an example configuration
  tableSelector: '.csv-from-html-flex',
  triggerSelector: '#csv-from-html-trigger-flex',
  rowSelector: '.csv-from-html-row',
  cellSelector: '.csv-from-html-col',
  colsDelimiter: ';'
})
```
2. Install webpack with
```
npm install -g webpack webpack-cli
```
3. Create the configuration file webpack.config.js at the root of your project and write inside it:
  ```javascript
  const path = require('path');
  
  module.exports = {
    mode: 'development',
    entry: './src/index.js', // the path of the JS file you created above
    output: {
      filename: 'my-csv-from-html.js', // the file you will include with script tag
      path: path.resolve(__dirname, 'dist') // the directory location of the file
    }
  };
```
Remember that, because of webpack's behavior, the scope of CsvFromHtml will be exclusively the boundled file. Therefore, you will have to write the entire code in the entry point (in this case, ./src/index.js').
4. Run
```
webpack
```
This command will create the source file at './dist/my-csv-from-html.js'
5. Include this tag in your html
```html
<script src="./dist/my-csv-from-html.js"></script>
``` 
### C) Using the package entry point as your script ```src``` attribute (![#f03c15](https://via.placeholder.com/15/f03c15/000000?text=+) don't use it in production)
This method falls under bad practice. It should be reserved for testing purposes and is strongly discouraged in production environments.
Just include this tag in your html:
```html
<script src="./node_modules/csv-from-html/dist/main.umd.min.js"></script>
```
## Usage
Create an object ```CsvFromHtml``` and pass the following **required** properties to the constructor:

- ```tableSelector```: a CSS selector for "table" element (the wrapper)
- ```rowSelector```: a CSS selector for "row" elements
- ```cellSelector```: a CSS selector for "cell" elements (the descendants of row elements)
- ```triggerSelector```: a CSS selector for the trigger, which must be an A tag uniquely identified

You can also pass to it the following **non-required** properties

- ```fileName```: the name of the file without extension (default is 'myFile')
- ```filter```: a callback ```function(innerText, rowIndex, colIndex, cell)``` that runs for each cell, which returns its innerText before it is saved in the csv.
     - Parameters
        - ```innerText```: the innerText of the current cell (required)
        - ```rowIndex```: the index (starting from 0) of the current row (optional)
        - ```colIndex```: the index (starting from 0) of the current column (optional)
        - ```cell```: the cell element (optional)
     - Return value  
     The value that will be saved in the csv file for the current cell
- ```colsDelimiter```: the column delimiter of the csv file (default is ';')

> When you create the CsvFromHtml object, neither the "table" element nor the "row" elements nor the "cell" elements nor the trigger element need to exist in the DOM.
> Using event delegation, it will capture the click event on the first element in the DOM Tree that currently matches the triggerSelector
> and create the csv file using the elements that currently matches the rowSelector and cellSelector.

## Example
```javascript
const csv = new CsvFromHtml({
      tableSelector: '.csv-from-html-table',
      triggerSelector: '#csv-from-html-trigger',
      rowSelector: '.csv-from-html-row',
      cellSelector: '.csv-from-html-cell',
      colsSeparator: ';',
      fileName: 'example-download',
      filter : function(t, i, j, c) {
          let textToSave = t
          if(i==0) {
            // Prepend some text to all cells from first row
            textToSave = 'Column ' + textToSave
          }
          if(c.classList.contains('special')) {
            // Wrap text from cells with class 'special' inside '***'
            textToSave = '***' + textToSave + '***'
          }
          return textToSave
      }
    })
```