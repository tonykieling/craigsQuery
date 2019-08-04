// https://www.npmjs.com/package/node-craigslist

const
  craigslist = require('node-craigslist'),
  client = new craigslist.Client({
    city : 'vancouver',
  // }),
  // options = {
    // baseHost : "craigslist.ca", // defaults to craigslist.org
    category        : "apa", // defaults to sss (all)
    postal          : "V5X0C7",
    searchDistance  : 1,
    minPrice        : '1000',
    maxPrice        : '1350'
  });
 
// client
//   .search(options)
//   .then((listings) => {
//     listings.forEach((listing) => console.log(listing));
//   })
//   .catch((err) => {
//     console.error(err);
//   });
client
  .list()
  // .then((listings) => listings.forEach(listing => console.log(listing)))
  // .then((listings) => listings.forEach(listing => console.log(client.details(listing))))
  .then((listings) => listings.forEach(listing => client.details(listing, (err, result) => console.log("#####result", result))))
  // .then((details) => {
  //   console.log(details);
  // })
  .catch((err) => {
    console.error(err);
  });