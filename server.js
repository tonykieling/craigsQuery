// https://www.npmjs.com/package/node-craigslist
// dotenv
// mailgun

const dateFormat = require('dateformat')
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
      name            : "Langara",
      category        : "apa",
      postal          : "V5Y2Z9",
      searchDistance  : 1,
      minPrice        : '1000',
      maxPrice        : '1350'
    },
    {
      name            : "Okridge",
      category        : "apa",
      postal          : "V5Z4H2",
      searchDistance  : 1,
      minPrice        : '1000',
      maxPrice        : '1350'
    },
    {
      name            : "MarineDrive",
      category        : "apa",
      postal          : "V5X0C7",
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
formatPrint = (myArray) => {
  // console.log("myArray", myArray.name);
  // myArray.forEach(item => console.log("item", item.name));
  const f = myArray.map((item, i) =>
    // console.log("item", item);
    // if (item.url) {
      `#item${i + 1} => 
        Title: ${item.title}
        Price: ${item.price}
        URL: ${item.url} \n\n`
    // }
  );
  // console.log("f---", f);
  return(`@${myArray.name} - total of ${Object.keys(myArray).length - 1} \n` + f.join(""));
}

myFunc = async () => {
  let arr = [];
  const x = await options.map(async item => {
    const z = await client.list(item);
    z["name"] = item.name;
    // console.log("item", z);
    return z;
    // await console.log("z", z);
  });
  const y = await Promise.all(x);
  // await console.log("---------------------", y);
  const final = await y.map(item => {
    // console.log("item", item);
    return formatPrint(item);
  });
  const kk = await Promise.all(final);
  // await console.log("kk", kk);
// const final = y.map(item => {
//   const k = await(item.name, item);
// });

  // const abc = await y.map(async item => {
  // //   await item.forEach(async newItem => {
  // //     console.log("url", newItem.url);
  // //   });    
  //   const result = await item.map(async newItem => {
  //     const zed = await client.details(newItem);
  //     return zed;
  //   });
  //   const final = await Promise.all(result);
  //   await console.log("final", final);
  //   // return final;
  // });
  // const f = await Promise.all(abc);
  // await console.log("****************", f);
// }
// myFunc = () => {
//   options.forEach(option => {
//     client
//       .list(option)
//       .then(answer => answer.map(item => client.details(item)))
//       .then(result => Promise.all(result))
//       .then(final => {
//         const data = {
//           from: "Mailgun Sandbox <postmaster@sandbox002b4d3efa304a4a92fa6ba15da0460f.mailgun.org>",
//           to: process.env.TO,
//           cc: process.env.CC,
//           subject: option.name,
//           text: formatPrint(option.name, final)
//         };
        
//         mg.messages().send(data, function (error, body) {
//             console.log("body", body);
//         });
//       });
//   });

  const data = {
    from: "Mailgun Sandbox <postmaster@sandbox002b4d3efa304a4a92fa6ba15da0460f.mailgun.org>",
    to: process.env.TO,
    cc: process.env.CC,
    subject: dateFormat(new Date(), "dddd  -  mmmm dS, yyyy  -  HH:MM"),
    text: kk
  };
  
  mg.messages().send(data, function (error, body) {
      console.log("body", body);
  });
}

// while(1) {
//   setTimeout(() => {
      myFunc();
//     }, 15000
//   );
// }


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

