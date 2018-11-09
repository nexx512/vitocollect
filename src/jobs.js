const fs = require("fs")
const Influx = require("influx")

module.exports = class Jobs {

  constructor(jobFile) {
    this.jobs = JSON.parse(fs.readFileSync(jobFile))
  }

  getInfluxSchema() {
    let schema = this.jobs.map((job) => {
      let fields = {}
      for (let field in job.fields) {
        fields[field] = Influx.FieldType[job.fields[field].type]
      }

      let measurement = {
        measurement: job.measurement,
        fields: fields,
        tags: job.tags ? Object.keys(job.tags) : []
      }

      return measurement
    })

    return schema
  }

}
