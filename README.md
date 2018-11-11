# VitoCollect

Collect data from [VControlD](https://github.com/openv/vcontrold) periodically and store the collected data
in an [Influx](https://www.influxdata.com/) database.

## Disclaimer

You use this software at your own risk. I can not be held liable for anything that happens to your heating system, including any damage, by the use of this software.

## Prerequisites

You need a running vcontrold server and an influx database.
Details on how to set up the hard- and software to get a vcontrold server running can be found in the [OpenV-Wiki](https://github.com/openv/openv/wiki).

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
