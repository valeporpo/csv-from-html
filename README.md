# csv-from-html
This library WITH NO DEPENDENCIES allows you to generate and download csv files containing the rendered text of HTML elements
(technicallys speaking, the [innerText](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/innerText) property of the element).
For example, starting from
```
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
it will produce this csv file:
. | A | B | C |
--- | --- | --- | --- |
1 | Donec condimentum | ligula sed maximus sagittis | Maecenas non auctor libero |
2 | Aliquam pellentesque leo et faucibus | Pellentesque varius | risus non ornare dapibus |
3 | Nullam tincidunt metus diam | et luctus ante vulputate vitae | Pellentesque commodo nisi metus |
4 | quis bibendum purus | finibus molestie | Lorem ipsum dolor sit amet |

Given an HTML structure like the one shown above, which is organized as a table without being (necessarily) an HTML table, once you have defined CSS selectors to identify an external wrapper (in the example, .csv-from-html-table) the "rows" (.csv-from-html-row) and "cells" within them (.csv-from-html-cell), you will be able to generate a csv file containing its innerText organized exactly as in the HTML structure.
The "row" elements constitute the row separators in the csv, and the "cell" elements constitute the separators between cells.

## Installation
The installation command is 'npm install csv-from-html'.

## Usage
First import the package with
```
import {CsvFromHtmlValidator} from 'csv-from-html'
```
Create an instance of class CsvFromHtml and pass the following **required** properties to the constructor:

- ```tableSelector```: a CSS selector for "table" element (the wrapper)
- ```rowSelector```: a CSS selector for "row" elements
- ```cellSelector```: a CSS selector for "cell" elements (the descendants of row elements)
- ```triggerSelector```: a CSS selector for the trigger, which must be an A tag uniquely identified

You can also pass to it the following **non-required** properties

- ```fileName```: the name of the file without extension (default is 'myFile')
- ```callbacks```: an array of objects each containig two attributes: selector and callback.
             Each callback is applied to the contents of each cell of the csv file that matches the selector.
             Callbacks are executed in the order in which the objects containing them are arranged in the array:
  first the callback of the object in position 0, then the callback of the object in position 1, and so on.
- ```colsDelimiter```: the column delimiter of the csv file (default is ';')

> [!TIP]
> When you create the CsvFromHtml object, neither the "row" elements nor the "cell" elements nor the trigger element need to exist in the DOM.
> Using event delegation, it will capture the click on the first element in the DOM Tree that currently matches thetriggerSelector
> and create the csv file using the elements that currently matches the rowSelector and cellSelector.

## Example
```
const csv = new CsvFromHtml({
      tableSelector: '.csv-from-html-table',
      triggerSelector: '#csv-from-html-trigger',
      rowSelector: '.csv-from-html-row',
      cellSelector: '.csv-from-html-cell',
      colsSeparator: ';',
      fileName: 'example-download',
      callbacks: [
        {
            selector : '*', // applies to all cells, before all other callbacks
            callback : function(text) {
                return 'Cell content: '+text;
            }
        },
        {
            selector : '.lowercase', // applies only to cells with class 'lowercase', as second
            callback : function(text) {
                return text.toLowerCase();
            }
        },
        {
            selector : '.uppercase', // applies only to cells with class 'uppercase', after every other callback
            callback : function(text) {
                return text.toUpperCase();
            }
        }
      ]
    })
```