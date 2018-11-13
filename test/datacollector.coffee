require("should")
sinon = require("sinon")

VControlClient = require("vcontrol")
DataCollector = require("../src/datacollector")

describe "A DataCollector object", =>
  beforeEach =>
    @vControl = new VControlClient({})
    @vControlMock = sinon.mock(@vControl)
    @dataCollector = new DataCollector(@vControl)

    # Use fields with all available types
    @fields = {
      "FloatField": {
        "type": "FLOAT",
        "command": "getFloat"
      },
      "StringField": {
        "type": "STRING",
        "command": "getString"
      }
    }


  it "should collect data for all fields from vcontrol", =>
    getDataStub = sinon.stub(@vControl, "getData")
    getDataStub.withArgs("getFloat").returns(Promise.resolve("1.2 Grad Celsius\n"))
    getDataStub.withArgs("getString").returns(Promise.resolve("Data\n"))
    @vControlMock.expects("connect").once()
    @vControlMock.expects("close").once()

    data = await @dataCollector.fetchData(@fields)

    data.should.eql {
      "FloatField": 1.2
      "StringField": "Data"
    }
    @vControlMock.verify()

  describe "with a an error file fetching data", =>
    it "should not write any data and close the connection", =>
      getDataStub = sinon.stub(@vControl, "getData")
      getDataStub.withArgs("getFloat").returns(Promise.reject(new Error("Fetch Error")))
      @vControlMock.expects("connect").once()
      @vControlMock.expects("close").once()

      data = await @dataCollector.fetchData(@fields)

      should(data).equal null
