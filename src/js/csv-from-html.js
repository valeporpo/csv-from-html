import {CsvFromHtmlValidator, allCsvFromHtmlInstances} from './csv-from-html-validator.js'

export default class CsvFromHtml {
    constructor(obj) {
      this.validator = new CsvFromHtmlValidator(obj);
      const validatorResponse = this.validator.validate()
      if (typeof validatorResponse === 'object' && typeof validatorResponse.status === 'string' && validatorResponse.status === 'fail') {
        throw new Error(
          validatorResponse.message
        );
      }
      
      this.fileType = "text/csv";
      this.fileExtension = ".csv";
      this.tableSelector = obj.tableSelector;
      this.rowSelector = obj.rowSelector;
      this.cellSelector = obj.cellSelector;
      this.triggerSelector = obj.triggerSelector;
  
      if (typeof obj.fileName !== "undefined") {
        this.fileName = obj.fileName;
      } else {
        this.fileName = "myFile";
      }
  
      if (typeof obj.delimiter !== "undefined") {
        this.colsSeparator = obj.delimiter;
      } else {
        this.colsSeparator = ";";
      }
      if (typeof obj.qualifier !== "undefined") {
        this.qualifier = obj.qualifier;
      } else {
        this.qualifier = '"';
      }
  
      this.loadTrigger();
  
      if (typeof obj.filter !== "undefined") {
        this.callback = obj.filter;
      }
  
      this.dataArray = [];
      this.blob, this.trigger;

      allCsvFromHtmlInstances.push(this)
      
    }
  
    loadTrigger() {

      document.addEventListener("click", (e) => {
        
        if (e.target.matches("a" + this.triggerSelector)) {
          this.trigger = document.querySelector(this.triggerSelector);
        } else if (e.target.closest(this.triggerSelector)) {
          this.trigger = e.target.closest(this.triggerSelector);
        } else {
          delete this.trigger;
        }
        if (typeof this.trigger !== "undefined" && this.trigger) {
          if (!this.trigger.classList.contains("ready")) {

            e.preventDefault();
            e.stopPropagation();
            
            this.buildBlob();
            this.trigger.click();
          } else {
            this.trigger.classList.remove("ready");
          }
        }
      });
    }
  
    getTable() {
      return document.querySelector(this.tableSelector);
    }
    getRows() {
      const table = this.getTable();
      if (table) return document.querySelectorAll(this.rowSelector);
      else return null;
    }
  
    buildBlob() {
      const rows = this.getRows();
      
      let row;
      if (!rows) return;
      
      for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
        row = [...rows[rowIndex].querySelectorAll(this.cellSelector)];
        this.dataArray.push(
          row
            .map((cell, colIndex) => {
              let text = cell.innerText;
              if (typeof this.callback === "function") {
                text = this.callback(text, rowIndex, colIndex, cell);
              }
              return this.qualifier + text + this.qualifier;
            })
            .join(this.colsSeparator)
        );
      }
  
      const input = this.dataArray.join("\n");
  
      this.blob = new Blob([input], { type: this.fileType });
      this.trigger.download = this.fileName + this.fileExtension;
      this.trigger.href = window.URL.createObjectURL(this.blob);
      this.trigger.dataset.downloadurl = [
        this.fileType,
        this.trigger.download,
        this.trigger.href,
      ].join(":");
      this.trigger.classList.add("ready");
      this.dataArray = [];
    }
  }