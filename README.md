# VitoCollect

Collect data from [VControlD](https://github.com/openv/vcontrold) periodically and store the collected data
in an [Influx](https://www.influxdata.com/) database.

## Disclaimer

You use this software at your own risk. I can not be held liable for anything that happens to your heating system, including any damage, by the use of this software.

## Prerequisites

You need a running vcontrold server and an influx database.
Details on how to set up the hard- and software to get a vcontrold server running can be found in the [OpenV-Wiki](https://github.com/openv/openv/wiki).

## Installation

Install with `npm install -g vitocollect` if you want the app to be in your path or `npm install vitocollect` for a local installatino in the current folder.

Copy `<node_modules directory>/config/config.example.json` to `<node_modules directory>/vitocollect/config/config.json` and adjust to your needs.

Copy `<node_modules directory>/vitocollect/jobs.example.json` to `<node_modules directory>/vitocollect/jobs.json` and adjust to your needs.

## Start

If installed globally, then you can start the application with
```
vitocollect
```

If you installed it locally, then start it with
```
./node_modules/.bin/vitocollect
```
