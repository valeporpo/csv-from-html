# cfh
This library allows you to generate and download csv files containing the text inside HTML elements
(technicallys speaking, the [innerText](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/innerText) property of the elements).
For example, starting from
```html
<div class="cfh-table">
  <div class="cfh-row">
    <div class="cfh-cell">Donec condimentum</div>
    <div class="cfh-cell">ligula sed maximus sagittis</div>
    <div class="cfh-cell">Maecenas non auctor libero</div>
  </div>
  <div class="cfh-row">
    <div class="cfh-cell">Aliquam pellentesque leo et faucibus</div>
    <div class="cfh-cell">Pellentesque varius</div>
    <div class="cfh-cell">risus non ornare dapibus</div>
  </div>
  <div class="cfh-row">
    <div class="cfh-cell">Nullam tincidunt metus diam</div>
    <div class="cfh-cell">et luctus ante vulputate vitae</div>
    <div class="cfh-cell">Pellentesque commodo nisi metus</div>
  </div>
  <div class="cfh-row">
    <div class="cfh-cell">quis bibendum purus</div>
    <div class="cfh-cell">finibus molestie</div>
    <div class="cfh-cell">Lorem ipsum dolor sit amet</div>
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

Given an HTML structure like the one shown above, which is organized as a table without being (necessarily) an HTML ```<table>```, once you have defined CSS selectors to identify an external wrapper (in the example, ```.cfh-table```) the "rows" (```.cfh-row```) and "cells" within them (```.cfh-cell```), you will be able to generate a csv file containing its innerText organized exactly _as it is_ in the HTML structure.
Every "row" element constitute a row in the csv, and every "cell" element constitute a cell inside a row.

## Installation
The installation command is
```
npm install cfh
```

## Import
Since this package is intended to run in the browser, you have to include it using a ```<script>``` tag in your html. You have three options to do that.

### A) Using a CDN (![#1589F0](https://via.placeholder.com/15/1589F0/000000?text=+) the easiest way)
Just include this tag in your html:
```html
<script src="https://unpkg.com/cfh@2.0.2/dist/main.umd.min.js"></script>
```
### B) Using a module boundler (![#c5f015](https://via.placeholder.com/15/c5f015/000000?text=+) the recommended way)
I'll give you an example of doing this with [webpack](https://webpack.js.org/). 
1. Create a JS file in your project, for example './src/index.js', where you import the ```CsvFromHtml``` class and write the code to generate your csv file:
```javascript
import CsvFromHtml from 'cfh'
    
const csv = new CsvFromHtml({
  // This is an example configuration
  tableSelector: '.cfh-flex',
  triggerSelector: '#cfh-trigger-flex',
  rowSelector: '.cfh-row',
  cellSelector: '.cfh-col',
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
      filename: 'my-cfh.js', // the file you will include with script tag
      path: path.resolve(__dirname, 'dist') // the directory location of the file
    }
  };
```
Remember that, because of webpack's behavior, the scope of CsvFromHtml will be exclusively the boundled file. Therefore, you will have to write the entire code in the entry point (in this case, ./src/index.js').  

4. Run
```
webpack
```
This command will create the source file at './dist/my-cfh.js'  

5. Include this tag in your html
```html
<script src="./dist/my-cfh.js"></script>
``` 
### C) Using the package entry point as your script ```src``` attribute (![#f03c15](https://via.placeholder.com/15/f03c15/000000?text=+) don't use it in production)
This method falls under bad practice. It should be reserved for testing purposes and is strongly discouraged in production environments.
Just include this tag in your html:
```html
<script src="./node_modules/cfh/dist/main.umd.min.js"></script>
```
## Usage
Create an object ```CsvFromHtml``` and pass the following **required** properties to the constructor:

- ```tableSelector```: a CSS selector for "table" element (the wrapper)
- ```rowSelector```: a CSS selector for "row" elements
- ```cellSelector```: a CSS selector for "cell" elements (the descendants of row elements)
- ```triggerSelector```: a CSS selector for the trigger, which must be an A tag uniquely identified

You can also pass to it the following **non-required** properties

- ```fileName```: the name of the file without extension (default is 'myFile')
- ```delimiter```: the column delimiter of the csv file (default is ```;```)
- ```qualifier```: the column qualifier of the csv file. Only ```"``` and ```'``` are valid entries (default is ```"```)
- ```filter```: a callback ```function(innerText, rowIndex, colIndex, cell)``` that runs for each cell, which returns its innerText before it is saved in the csv.
     - Parameters
        - ```innerText```: the innerText of the current cell (required)
        - ```rowIndex```: the index (starting from 0) of the current row (optional)
        - ```colIndex```: the index (starting from 0) of the current column (optional)
        - ```cell```: the cell element (optional)
     - Return value  
     The value that will be saved in the csv file for the current cell

> :bulb: When you create the CsvFromHtml object, neither the "table" element nor the "row" elements nor the "cell" elements nor the trigger element need to exist in the DOM.
> Using event delegation, it will capture the click event on the first element in the DOM Tree that currently matches the triggerSelector
> and create the csv file using the elements that currently matches the rowSelector and cellSelector.

## Example
```javascript
const csv = new CsvFromHtml({
      tableSelector: '.cfh-table',
      triggerSelector: '#cfh-trigger',
      rowSelector: '.cfh-row',
      cellSelector: '.cfh-cell',
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