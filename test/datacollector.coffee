require("should")
sinon = require("sinon")

VControlClient = require("vcontrol-client")
DataCollector = require("../src/datacollector")

describe "A DataCollector object", =>
  before =>
    @vControl = new VControlClient({})
    @vControlMock = sinon.mock(@vControl)
    @dataCollector = new DataCollector(@vControl)

  it "should collect data for all fields from vcontrol", =>
    getDataStub = sinon.stub(@vControl, "getData")
    getDataStub.withArgs("getFloat").returns(Promise.resolve("1.2 Grad Celsius\n"))
    getDataStub.withArgs("getString").returns(Promise.resolve("Data\n"))
    @vControlMock.expects("connect").once()
    @vControlMock.expects("close").once()

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
    @vControlMock.verify()
