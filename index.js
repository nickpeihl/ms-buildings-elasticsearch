const fs = require("fs");
const { Client } = require("@elastic/elasticsearch");
const split = require("split2");
const { faker } = require('@faker-js/faker');

const client = new Client({
  node: "http://localhost:9200",
  auth: {
    apiKey: "<my-api-key>",
  },
});

function generateFakeInfo() {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    addressNumber: faker.location.buildingNumber(),
    streetName: faker.location.street(),
    city: faker.location.city(),
    state: faker.location.state(),
    zip: faker.location.zipCode(),
  }
}

const index = "ms-buildings";
const mapping = {
  dynamic: false,
  properties: {
    geometry: { type: "geo_shape" },
    firstName: { type: "keyword" },
    lastName: { type: "keyword" },
    addressNumber: { type: "long"},
    streetName: { type: "keyword" },
    city: { type: "keyword" },
    state: { type: "keyword" },
    zip: { type: "keyword" },
  },
};

async function run() {
  const exists = await client.indices.exists({
    index: "ms-buildings",
  });
  if (!exists) {
    await client.indices.create({
      index,
      body: {
        mappings: mapping,
      },
    });
  }

  const dropStream = fs.createWriteStream("./droppedDocuments.ndjson", {
    flags: "a",
  });

  const results = await client.helpers.bulk({
    datasource: fs
      .createReadStream(process.argv[2], { encoding: "utf8" })
      .pipe(split(JSON.parse)),
    onDocument(doc) {
      debugger;
      return [
        { index: { _index: index } },
        { geometry: doc.geometry, ...generateFakeInfo() },
      ];
    },
    onDrop(doc) {
      dropStream.write(`${doc}\r\n`);
    },
  });

  return results;
}

run()
  .then((res) => console.log(JSON.stringify(res, null, 2)))
  .catch((err) => {
    console.error(err);
  });
