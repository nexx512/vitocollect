# VitoCollect

Collect data from [VControlD](https://github.com/openv/vcontrold) periodically and store the collected data
in an [Influx](https://www.influxdata.com/) database.

## Installation

Checkout from `https://github.com/nexx512/vitocollect.git`.

Copy `config/config.example.json` to `config/config.json` and adjust to your needs.

Copy `jobs.example.json` to `jobs.json` and adjust to your needs.

## Start

Start service with
```
npm start
```
or
```
node app.js
```
