const { hasChange }           = require("./aux/hasChange.js");
const { formatDataToBeSent }  = require("./aux/formatDataToBeSent.js");

const dateFormat  = require('dateformat');

const gMinPrice     = 1100,
      gMaxPrice     = 1350
      defaultRatio  = 0.7;

let beforeData    = null;

const
  craigslist      = require('node-craigslist'),
  client          = new craigslist.Client({
    city : 'vancouver',
  }),
  generalOptions  = {   // they are shared for all objects that will be queried
      category        : "apa",
      searchDistance  : defaultRatio,
      minPrice        : gMinPrice,
      maxPrice        : gMaxPrice
  }
  options = [
    {
      name            : "Langara",
      postal          : "V5Y2Z9",
      category        : generalOptions.category,
      searchDistance  : generalOptions.searchDistance,
      minPrice        : generalOptions.minPrice,
      maxPrice        : generalOptions.maxPrice
    },
    {
      name            : "Oakridge",
      postal          : "V5Z4H2",
      category        : generalOptions.category,
      searchDistance  : generalOptions.searchDistance,
      minPrice        : generalOptions.minPrice,
      maxPrice        : generalOptions.maxPrice
    },
    {
      name            : "MarineDrive",
      postal          : "V5X0C7",
      category        : generalOptions.category,
      searchDistance  : generalOptions.searchDistance,
      minPrice        : generalOptions.minPrice,
      maxPrice        : generalOptions.maxPrice
    },
    {
      name            : "KingEdward",
      postal          : "V5Z2C4",
      category        : generalOptions.category,
      searchDistance  : generalOptions.searchDistance,
      minPrice        : generalOptions.minPrice,
      maxPrice        : generalOptions.maxPrice
    },
    {
      name            : "CityHall",
      postal          : "V5Z2V2",
      category        : generalOptions.category,
      searchDistance  : generalOptions.searchDistance,
      minPrice        : generalOptions.minPrice,
      maxPrice        : generalOptions.maxPrice
    }
  ];



// main function of the system
// this function that queries craigslist
// it calls an auxiliary function to check if there is change between the last query and the current one
// also, if the case, it call the function to send email - using mailgun
mainFunc = async () => {

  const getList = await options.map(async item => {
    const eachItem = await client.list(item);
    eachItem["name"] = item.name;
    return eachItem;
  });
  const list = await Promise.all(getList);

  if (!beforeData){
    // first time the system runs it send the email with the received data from craigslist
    console.log("FIRST TIME");
    const flag = "first";
    formatDataToBeSent(list, flag, gMinPrice, gMaxPrice);

  } else {
    // it calls a function to compare list and beforeData, if there are changes
    // if they are diff, the system send the email
    const d = new Date(),
          utc = d.getTime() + (d.getTimezoneOffset() * 60000),
          cTime = new Date(utc + (3600000 * -7));

    const queryToHasChange = await hasChange(beforeData, list);

    if (await queryToHasChange){
      console.log(" ==> diff data!! - ", dateFormat(cTime, "HH:MM"));
      formatDataToBeSent(list);
    } else {
      console.log(" no changes => ", dateFormat(cTime, "HH:MM"));
      return;
    }
  }

  beforeData = null;
  beforeData = [...list];
}



// this is the main time controller of the application
// it will run while the system still running because here is where is defined the intervals to check on craigslist
mainController = () => {
  clearInterval(secondT);
  mainFunc();   
  let interval    = 1000 * 60 * 15;  

  // this function runs forever, while this application is running
  setInterval(() => {
    mainFunc();
  }, interval);
}




// this is the function to round the timer to multiple of 15 minutes
// it's gonna be executed only once
fFifteen = () => {
  clearInterval(firstT);
  secondT = setInterval(() => {
    const d = new Date(),
          utc = d.getTime() + (d.getTimezoneOffset() * 60000),
          cTime = new Date(utc + (3600000 * -7));

    console.log(`#15sec running @${dateFormat(cTime, "HH:MM:ss")}`);

    if (((dateFormat(cTime, "MM")) % 15) === 0) {
      console.log("got FIFTEEN", dateFormat(cTime, "HH:MM:ss"));
      mainController();
    }

  }, (1000 * 60));
}



// function to clock's syncronize
// it will be trigged when the timer gets 0 seconds in order to start each fifteen iterarion at zero seconds
// it's gonna be executed only once
fZero = () => {
  firstT = setInterval(() => {
    const d = new Date(),
          utc = d.getTime() + (d.getTimezoneOffset() * 60000),
          cTime = new Date(utc + (3600000 * -7));

    const t = dateFormat(cTime, "ss");
    console.log("time = ", t);

    if (t === "00" || t === "01") {
      console.log("got ZERO", dateFormat(cTime, "HH:MM:ss"));
      fFifteen();

    }
  }, 1000);
}


// it runs at the very beggining to send the first email
// it runs only once
const d = new Date(),
      utc = d.getTime() + (d.getTimezoneOffset() * 60000),
      cTime = new Date(utc + (3600000 * -7));
console.log(`# first running @${dateFormat(cTime, "HH:MM:ss")}`);
mainFunc();
let firstT  = null;
let secondT = null;
fZero();