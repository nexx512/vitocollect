require("should")
sinon = require("sinon")

VControlClient = require("vcontrol-client")
DataCollector = require("../src/datacollector")

describe "A DataCollector object", =>
  before =>
    @vControlClient = new VControlClient({})
    @vControlClientMock = sinon.mock(@vControlClient)
    @dataCollector = new DataCollector(@vControlClient)

  it "should collect data for all fields from vcontrol", =>
    getDataStub = sinon.stub(@vControlClient, "getData")
    getDataStub.withArgs("getFloat").returns(Promise.resolve("1.2 Grad Celsius\n"))
    getDataStub.withArgs("getString").returns(Promise.resolve("Data\n"))
    @vControlClientMock.expects("connect").once()
    @vControlClientMock.expects("close").once()

    # Use fields with all available types
    fields = {
      "FloatField": {
        "type": "FLOAT",
        "command": "getFloat"
      },
      "StringField": {
        "type": "STRING",
        "command": "getString"
      }
    }

    data = await @dataCollector.fetchData(fields)

    data.should.eql {
      "FloatField": 1.2
      "StringField": "Data"
    }
    @vControlClientMock.verify()
