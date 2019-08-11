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

formatPrint = (myArray) => {
  const f = myArray.map((item, i) =>
      `#item${i + 1} => 
        Title: ${item.title}
        Price: ${item.price}
        URL: ${item.url} \n\n`
  );
  return(`@${myArray.name} - total of ${Object.keys(myArray).length - 1} \n` + f.join(""));
}


sendEmail = (content) => {
  const data = {
    from: "Mailgun Sandbox <postmaster@sandbox002b4d3efa304a4a92fa6ba15da0460f.mailgun.org>",
    to: process.env.TO,
    // cc: process.env.CC,
    subject: dateFormat(new Date(), "dddd  -  mmmm dS, yyyy  -  HH:MM"),
    text: content
  };
  
  mg.messages().send(data, function (error, body) {
      console.log("body", body);
  });  
}

myFunc = async () => {
  const getList = await options.map(async item => {
    const eachItem = await client.list(item);
    eachItem["name"] = item.name;
    return eachItem;
  });
  const list = await Promise.all(getList);
  const getFormated = await list.map(item => {
    return formatPrint(item);
  });
  const data = await Promise.all(getFormated);

  sendEmail(data);

}

// while(1) {
//   setTimeout(() => {
      myFunc();
//     }, 15000
//   );
// }

