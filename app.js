#!/usr/bin/env node

const VControl = require("vcontrol")
const Influx = require("influx")
const path = require("path")

const Jobs = require("./src/jobs")
const DataCollector = require("./src/datacollector")

global.Config = require(path.join(__dirname, "/config/config.json"))

async function main() {
  const jobs = new Jobs(path.join(__dirname, "./jobs.json"))
  const schema = jobs.getInfluxSchema()

  let influxClient = new Influx.InfluxDB({
    host: Config.influx.host,
    database: Config.influx.database,
    schema: schema
  })


  jobs.jobs.forEach((job) => {
    setInterval(async () => {
      try {
        let vControl = new VControl({
          host: Config.vcontrold.host,
          port: Config.vcontrold.port,
          timeout: 10000
        })
        let dataCollector = new DataCollector(vControl)

        let fields = await dataCollector.fetchData(job.fields)

        if (fields) {
          await influxClient.writePoints([{
            measurement: job.measurement,
            tags: {},
            fields: fields
          }])
        }
      } catch (e) {
        console.error(e.toString())
      }
    }, job.interval);
    console.log("Installed job " + job.measurement)
  })

}

main()
