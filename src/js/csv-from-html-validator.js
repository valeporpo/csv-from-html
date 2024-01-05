export class CsvFromHtmlValidator {
    constructor(obj) {
      this.input = obj;
      this.required = ["tableSelector", "rowSelector", "cellSelector", 'triggerSelector'];
      this.nonRequired = ["fileName", "callbacks", "colsDelimiter"];
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
  
      //Invalid callbacks
      if (
        typeof this.input.callbacks === "object" &&
        this.input.callbacks.length
      ) {
        for (let i = 0; i < this.input.callbacks.length; i++) {
          if (
            typeof this.input.callbacks[i].callback !== "function" ||
            typeof this.input.callbacks[i].selector !== "string" ||
            this.input.callbacks[i].callback.length !== 1
          ) {
            return false;
          }
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