module.exports = class DataCollector {
  constructor(vControl) {
    this.vControl = vControl
  }

  async fetchData(fields) {
    await this.vControl.connect()

    let data = {}

    for (let fieldName in fields) {
      let field = fields[fieldName]
      try {
        let vControlResponse = await this.vControl.getData(field.command)
        switch (field.type) {
          case "FLOAT": data[fieldName] = Number.parseFloat(vControlResponse)
            break;
          default: data[fieldName] = vControlResponse.split("\n")[0]
        }
      } catch (e) {
        Log.error(e.toString())
        data = null
        break;
      }
    }

    await this.vControl.close()
    return data
  }
}
