module.exports = class DataCollector {
  constructor(vControlClient) {
    this.vControlClient = vControlClient
  }

  async fetchData(fields) {
    await this.vControlClient.connect()

    let data = {}

    for (let fieldName in fields) {
      let field = fields[fieldName]
      let vControlResponse = await this.vControlClient.getData(field.command)
      switch (field.type) {
        case "FLOAT": data[fieldName] = Number.parseFloat(vControlResponse)
          break;
        default: data[fieldName] = vControlResponse.split("\n")[0]
      }
    }

    await this.vControlClient.close()
    return data
  }
}
