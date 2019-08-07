// https://www.npmjs.com/package/node-craigslist
// dotenv
// mailgun

require("dotenv").config();
const mailgun = require("mailgun-js");
const mg = mailgun({apiKey: process.env.APIKEY, domain: process.env.DOMAIN});


const
  craigslist = require('node-craigslist'),
  client = new craigslist.Client({
    city : 'vancouver',
  }),
  options = [
    {
      name            : "MarineDrive",
      category        : "apa",
      postal          : "V5X0C7",
      searchDistance  : 1,
      minPrice        : '1000',
      maxPrice        : '1350'
    },
    {
      name            : "Langara",
      category        : "apa",
      postal          : "V5Y2Z9",
      searchDistance  : 1,
      minPrice        : '1000',
      maxPrice        : '1350'
    }    
  ];

// // query for only one option
// myFunc = async () => {
//   console.log("SIMPLE - inside myFunc");
//   const list = await client.list(options);
//   const details = await list.map(item => client.details(item));
//   const all = await Promise.all(details).then(v => v);
//   await console.log("+++++++++++++++++++++++++++++++++++ALL", all);
// }

// // query for multiple options
// myFunc = async () => {
//   console.log("MULTIPLE - inside myFunc");
//   let lists = [];
//   await options.forEach(async option => {
//     lists[option.name] = await client.list(option);
//     // await console.log(`=> ${option.name}`, lists[option.name]);
//     // await console.log("-----------------------------------------------------------------");
//   });

//   setTimeout(() => {
//     console.log("lists:::::::::::::::::::::::::::::::: \n", lists);
//   }, 3000);
//   // const lists = await options.map(option => {
//   //   lists[option.name] = client.list(option);
//   // });
//   // await lists.forEach(item => console.log(item.name, item))
//   // const details = await list.map(item => client.details(item));
//   // const all = await Promise.all(details).then(v => v);
//   // await console.log("+++++++++++++++++++++++++++++++++++ALL", all);
// }

// myFunc();
formatPrint = (name, myArray) => {
  const f = myArray.map((item, i) =>
    `#item${i + 1} => PID: ${item.pid} - Title: ${item.title} - Price: ${item.price} - URL: ${item.url} \n`);

  return(
    `@Place Reference: ${name} \n` + f.join("")
  );
}

let msg = [];
options.forEach(option => {
  client
    .list(option)
    // .then(console.log)
    // .then(answer => answer.map(item => client.details(item)))
    // .then(result => Promise.all(result))
    // .then(final => console.log(formatPrint(option.name, final)))
    .then(result => {
      msg.push(result);
      const data = {
          from: "Mailgun Sandbox <postmaster@sandbox002b4d3efa304a4a92fa6ba15da0460f.mailgun.org>",
          to: process.env.TO,
          // cc: process.env.CC,
          subject: "Hello",
          text: formatPrint(option.name, msg)
        };
        
        mg.messages().send(data, function (error, body) {
            console.log("body", body);
        });
    });


    // .list(option, (err, result) => {
    //   if (err) throw err.message;
    //   // console.log("result", result);
    //   result.forEach((item, i) => {
    //     // console.log(`${i} - ${option.name}\n ${JSON.stringify(item)}\n`);
    //     console.log(`${i} - ${option.name}\n`);
    //     client.details(item, async (err, resultDetails) => {
    //       await console.log(`${i} => ${JSON.stringify(resultDetails)}`)
    //     });
    //   });
    // });
});
  // // .then(listings => listings.forEach((listing, i) => console.log(`${i + 1}### ${listing}`)))
  // // .then(listings => console.log(listings.length))
  // // .then(listings => listings.forEach((listing, i) => console.log(listings.length, i)))
  // // .then(listings => listings.forEach(listing => client.details(listing, (err, result) => console.log("#####result", result))))
  // .then(listings => listings.forEach(listing => client.details(listing, (err, result) => myArr.push(result))))
  // .then(console.log(myArr))
  // .catch((err) => {
  //   console.error(err);
  // });


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

