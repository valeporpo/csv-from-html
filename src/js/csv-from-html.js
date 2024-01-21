import {
  CsvFromHtmlValidator,
  allCsvFromHtmlInstances,
} from "./csv-from-html-validator.js";

export default class CsvFromHtml {
  constructor(obj) { 
    this.validator = new CsvFromHtmlValidator(obj);
    
    const validatorResponse = this.validator.validate();
    if (
      typeof validatorResponse === "object" &&
      typeof validatorResponse.status === "string" &&
      validatorResponse.status === "fail"
    ) {
      throw new Error(validatorResponse.message);
    }

    this.fileType = "text/csv";
    this.fileExtension = ".csv";
    this.tableSelector = obj.tableSelector;
    this.rowSelector = obj.rowSelector;
    this.cellSelector = obj.cellSelector;

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

    if (typeof obj.triggerSelector !== "undefined") {
      this.triggerSelector = obj.triggerSelector;
      this.loadTrigger();
    }

    if (typeof obj.filter !== "undefined") {
      this.callback = obj.filter;
    }

    this.downloadBtnClass = 'cfh-download-'+Math.random().toString().substring(2);

    this.dataArray = [];
    this.blob, this.trigger;

    allCsvFromHtmlInstances.push(this);
  }

  loadTrigger() {
    document.addEventListener("click", (e) => {
      if (e.target.matches(this.triggerSelector) && !e.target.classList.contains(this.downloadBtnClass)) {
          e.preventDefault();
          e.stopPropagation();
          this.download();
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
  }

  download() {
    const hiddenLink = document.createElement("a");
    hiddenLink.classList.add(this.downloadBtnClass);
    this.buildBlob();

    const temporaryUrl = URL.createObjectURL(this.blob);
    hiddenLink.setAttribute("href", temporaryUrl);
    hiddenLink.setAttribute("download", this.fileName + this.fileExtension);
    hiddenLink.style.visibility = "hidden";
    hiddenLink.style.display = "none";
    document.body.appendChild(hiddenLink);
    hiddenLink.click();
    document.body.removeChild(hiddenLink);
    this.dataArray = [];
  }
}
