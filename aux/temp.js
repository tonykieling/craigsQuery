// const dateFormat = require('dateformat');

// mainF = () => {
//   clearInterval(sT);
//   console.log("DONE!!!!");
// }

// y = () => {
//   clearInterval(fT);
//   sT = setInterval(() => {
//     const t = Number(dateFormat(new Date(), "ss"));
//     console.log("20 - INSIDE twenty")
//     console.log("  seconds= ", t);
//     if ((t % 20) === 0) {
//       console.log("GOTCHA !!");
//       mainF();
//     }
//   }, 5000);
// }

//  x = () => {
//    fT = setInterval(() => {
//     const t = Number(dateFormat(new Date(), "ss"));
//     console.log("1- inside ONE sec function")
//     console.log("  seconds= ", t);
//     if ((t % 5) === 0){
//       console.log("==> going to 5555555", t);
//       y();
//     }
//   }, 1000);
// }

// let fT = null;
// let sT = null;
// console.log("# Starting!")
// x();



const list = [
  [
    {
      pid   : 1,
      price : 10,
      url   : "http://1111111111111",
      title : "TITLE 11111111111111"
    }
    // {
    //   pid   : 2,
    //   price : 20,
    //   url   : "http://2222222222222",
    //   title : "TITLE 22222222222222"
    // }
  ],
  [
    {
      pid   : 3,
      price : 300,
      url   : "http://3333333333333",
      title : "TITLE 33333333333333"
    },
    {
      pid   : 5,
      price : 500,
      url   : "http://5555555555555",
      title : "TITLE 55555555555555"
    }
  ]
];
list[0].name = "Langara";
list[1].name = "Oakridge";


const beforeData = [
  [
    {
      pid   : 1,
      price : 10,
      url   : "http://1111111111111",
      title : "TITLE 11111111111111"
    },
    {
      pid   : 2,
      price : 20,
      url   : "http://2222222222222",
      title : "TITLE 22222222222222"
    }
  ],
  [
    {
      pid   : 3,
      price : 30,
      url   : "http://3333333333333",
      title : "TITLE 33333333333333"
    }
  //   {
  //     pid   : 4,
  //     price : 40,
  //     url   : "http://4444444444444",
  //     title : "TITLE 44444444444444"
  //   }
  ]
];
beforeData[0].name = "Langara";
beforeData[1].name = "Oakridge";


// this function only checks whether the data before and current are the same
// if so, the system may not send the email because nothing has changed
isEqual = (before, current) => {
  let someChange = false;
  // let internalChange = false;
  for (let c of current)
    for (let b of before)
      if (b.name === c.name) {
        for (let objC of c) {
          let countC = 0;
          for (let objB of b) {
            if (objB.pid === objC.pid) {
              objB.flag = true;
              if (objB.price !== objC.price) {
                objC.modify     = "Changed";
                someChange       = true;
                // internalChange  = true;
              }
              break;
            } else {
              countC += 1;
              if (countC === b.length) {
                someChange       = true;
                objC.modify     = "New";
                // internalChange  = true;
                break;
              }
            }
          }
        }
        // if (!internalChange)
          for (let objB of b)
            if (!objB.flag) {
              objB.modify = "Deleted";
              someChange   = true;
              c.push(objB);
            }
      }
  return(someChange && current);
}

// compareLists = (beforeData, list) => {
//   // console.log("###beforeData", beforeData);
//   // console.log("###current", list);
//   return isEqual(beforeData, list);
// }

console.log(isEqual(beforeData, list));