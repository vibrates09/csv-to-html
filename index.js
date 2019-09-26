new Vue({
  el: '#app',
  data () {
    return {
      tableData: [],
      tableHeader: []
    }
  },
  methods: {
    handleClientUpload(event) {
      const files = event.target.files
      if (window.FileReader) {
        this.getText(files[0])
      } else {
        alert("FileReader are not supported in this browser.")
      }
    },
    getText(fileToRead) {
      const reader = new FileReader()
      reader.onload = this.handleLoad
      reader.onerror = this.handleError
      reader.readAsText(fileToRead)
    },
    handleLoad (event) {
      const csv = event.target.result
      this.formatForTable(csv)
    },
    handleError (event) {
      if (evt.target.error.name == "NotReadableError") {
        alert("Canno't read file!")
      }
    },
    formatForTable(csv) {
      const rows = csv.split(/\r\n|\n/)

      const cleanRows = rows.map((el, index) => {
        const cells = el.split(/[,](?=(?:[^"]|"[^"]*")*$)/g)

        return cells.map(el => {
          const hasDoubleQuotes = [el.charAt(0), el.charAt(el.length - 1)]
          if (hasDoubleQuotes.every(el => el === '"')) {
            return el.slice(1, -1)
          }
          return el
        })

      }).filter(el => el.length > 1)

      const tableHeader = cleanRows.shift()
      this.tableHeader = tableHeader

      cleanRows.forEach((el) => {

        const childObj = {}

        el.forEach((row, index) => {
          childObj[tableHeader[index]] = row
        })
        this.tableData.push(childObj)
        return childObj
      })
    }
  }
})
