#!/usr/bin/env node

const VControl = require("vcontrol");
const Influx = require("influx");
const path = require("path");

const Jobs = require("./src/jobs");
const DataCollector = require("./src/datacollector");

const debug = !!process.env.DEBUG

global.Config = require(path.join(__dirname, "/config/config.json"));

function log(level, msg) {
  console.log(Date() + " [" + level + "] " + msg)
}

global.Log = {
  error: (msg) => log("error", msg),
  debug: (msg) => {
    if (debug) log("debug", msg)
  }
}

async function main() {
  const jobs = new Jobs(path.join(__dirname, "./jobs.json"));
  const schema = jobs.getInfluxSchema();

  let influxConfig = Config.influx;
  influxConfig.schema = schema;
  let influxClient = new Influx.InfluxDB(influxConfig);


  jobs.jobs.forEach((job) => {
    // Reuse same client to enfoce an exception when connecting if the previous job didn't finish yet.
    // This prevents acummulating vcontrold tasks on the server if the interval time is too small to execute the jobs.
    let vControl = new VControl({
      host: Config.vcontrold.host,
      port: Config.vcontrold.port,
      debug: debug
    });
    setInterval(async () => {
      try {
        let dataCollector = new DataCollector(vControl);

        let fields = await dataCollector.fetchData(job.fields);

        if (fields) {
          await influxClient.writePoints([{
            measurement: job.measurement,
            tags: {},
            fields: fields
          }]);
        }
      } catch (e) {
        Log.error(e.toString());
      }
    }, job.interval);
    Log.debug("Installed job " + job.measurement);
  })

}

main();
