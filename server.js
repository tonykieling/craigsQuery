// https://www.npmjs.com/package/node-craigslist
// dotenv

const
  craigslist = require('node-craigslist'),
  client = new craigslist.Client({
    city : 'vancouver',
  }),
  options = {
    name            : "Marine Drive",
    category        : "apa", // defaults to sss (all)
    postal          : "V5X0C7",
    searchDistance  : 1,
    minPrice        : '1000',
    maxPrice        : '1350'
  };

myFunc = async () => {
  console.log("inside myFunc");
  const list = await client.list(options);
  const details = await list.map(item => client.details(item));
  const all = await Promise.all(details).then(v => v);
  await console.log("+++++++++++++++++++++++++++++++++++ALL", all);
}

myFunc();

// client
//   .list(options)
//   // .then(listings => listings.forEach((listing, i) => console.log(`${i + 1}### ${listing}`)))
//   // .then(listings => console.log(listings.length))
//   // .then(listings => listings.forEach((listing, i) => console.log(listings.length, i)))
//   // .then(listings => listings.forEach(listing => client.details(listing, (err, result) => console.log("#####result", result))))
//   .then(listings => listings.forEach(listing => client.details(listing, (err, result) => myArr.push(result))))
//   .then(console.log(myArr))
//   .catch((err) => {
//     console.error(err);
//   });

