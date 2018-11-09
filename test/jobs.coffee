require("should")
Influx = require("influx")
Jobs = require("../src/jobs")

describe "When parsing a job description file", ->
  jobs = null

  before ->
    jobs = new Jobs(__dirname + "/jobs.json")

  it "should generate a schema definition for the influx DB", ->
    jobs.getInfluxSchema().should.eql [
      measurement: "Measurement1"
      fields: {
        Val1: Influx.FieldType.FLOAT,
        Val2: Influx.FieldType.STRING
      }
      tags: []
    ,
      measurement: "Measurement2"
      fields: {}
      tags: [
        "Tag1", "Tag2"
      ]
    ]
