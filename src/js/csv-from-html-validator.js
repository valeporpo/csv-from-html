export class CsvFromHtmlValidator {
    constructor(obj) {
      this.input = obj;
      this.required = ["tableSelector", "rowSelector", "cellSelector", 'triggerSelector'];
      this.nonRequired = ["fileName", "filter", "colsDelimiter"];
      this.allowed = this.required.concat(this.nonRequired);
    }
    
    validate() {
      if (typeof this.input !== "object") {
        return {
          status : 'fail',
          message : 'Invalid parameter type for constructor'
        }
      }
      for (let i = 0; i < Object.keys(this.input).length; i++) {
        if (this.allowed.indexOf(Object.keys(this.input)[i]) < 0) {
          return {
            status : 'fail',
            message : 'Non allowed property name "' + Object.keys(this.input)[i] + '"'
          }
        }
      }
      for (let i = 0; i < this.required.length; i++) {
        if (Object.keys(this.input).indexOf(this.required[i]) < 0 || !this.input[this.required[i]].length) {
          return {
            status : 'fail',
            message : 'Missing property name: "'+this.required[i] + '"'
          }
        }
      }
      if (typeof this.input.filter === "function") {
          if (this.input.filter.length < 1 || this.input.filter.length > 4) {
            return {
              status : 'fail',
              message : 'Invalid parameters in "filter" function'
            }
          }
      }
      let instance
      for(let i=0; i<allCsvFromHtmlInstances.length; i++) {
        instance = allCsvFromHtmlInstances[i]
        if(instance.tableSelector === this.input.tableSelector || instance.triggerSelector === this.input.triggerSelector)
        return {
          status : 'fail',
          message : 'Cannot create multiple instances of CsvFromHtml with the same wrapper nor with the same trigger'
        }
      }
  
      return {
        status : 'success'
      }
    }
  }

  export const allCsvFromHtmlInstances = []