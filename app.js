const VControlClient = require("vcontrol-client")
const Influx = require("influx")

const Jobs = require("./src/jobs")
const DataCollector = require("./src/datacollector")

global.Config = require("./config/config.json")

async function main() {
  const jobs = new Jobs("./jobs.json")
  const schema = jobs.getInfluxSchema()

  let vControlClient = new VControlClient({
    host: Config.vcontrold.host,
    port: Config.vcontrold.port
  })
  let influxClient = new Influx.InfluxDB({
    host: Config.influx.host,
    database: Config.influx.database,
    schema: schema
  })

  let dataCollector = new DataCollector(vControlClient)

  jobs.jobs.forEach((job) => {
    setInterval(async () => {
      try {
        let fields = await dataCollector.fetchData(job.fields)
        await influxClient.writePoints([{
          measurement: job.measurement,
          tags: {},
          fields: fields
        }])
      } catch (e) {
        console.error(e)
      }
    }, job.interval);
  })

}

main()
