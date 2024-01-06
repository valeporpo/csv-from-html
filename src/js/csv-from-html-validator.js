export class CsvFromHtmlValidator {
    constructor(obj) {
      this.input = obj;
      this.required = ["tableSelector", "rowSelector", "cellSelector", 'triggerSelector'];
      this.nonRequired = ["fileName", "filter", "colsDelimiter"];
      this.allowed = this.required.concat(this.nonRequired);
    }
    
    validate() {
      // Invalid input type
      if (typeof this.input !== "object") return false;
      // Non allowed property name
      for (let i = 0; i < Object.keys(this.input).length; i++) {
        if (this.allowed.indexOf(Object.keys(this.input)[i]) < 0) {
          return false;
        }
      }
      // Missing property name
      for (let i = 0; i < this.required.length; i++) {
        if (Object.keys(this.input).indexOf(this.required[i]) < 0 || !this.input[this.required[i]].length) {
          return false;
        }
      }
      //Invalid callback
      if (typeof this.input.filter === "function") {
          if (this.input.filter.length < 1 || this.input.filter.length > 4) {
            return false;
          }
      }
      let instance
      for(let i=0; i<allCsvFromHtmlInstances.length; i++) {
        instance = allCsvFromHtmlInstances[i]
        if(instance.tableSelector === this.input.tableSelector || instance.triggerSelector === this.input.triggerSelector)
          return false
      }
  
      return true;
    }
  }

  export const allCsvFromHtmlInstances = []