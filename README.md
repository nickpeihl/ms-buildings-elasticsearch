# Ingest Microsoft Building Footprints into Elasticsearch

This example ingests [building footprints created and released by Microsoft](https://github.com/Microsoft/USBuildingFootprints). The data is licensed under the [Open Data Commons Open Database License](https://opendatacommons.org/licenses/odbl/).

## Installation and Setup

1) Install GDAL >=2.4 (ex. MacOs: `brew install gdal`)
2) Install Node.js
3) Configure the client node and api key in index.js
4) To ingest all 50 US states, type `make`.
5) To ingest only one state, type `make <statename>` (example `make RhodeIsland`). Note, the available `statename` parameters are listed in the Makefile.

The `make` command will download and parse the specified state(s) GeoJSON file(s) into newline delimited GeoJSON features. Each feature geometry is simplified and repaired to be compatible with Elasticsearch (OGR SimpleFeature Specification). A `ms-buildings` index is automatically created and features are streamed into Elasticsearch.

WARNING: `make clean` will remove all downloaded files and delete the Elasticsearch index
