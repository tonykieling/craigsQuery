const list = [
  [
    {
      pid   : 1,
      price : 10
    },
    {
      pid   : 2,
      price : 20
    }
  ],
  [
    {
      pid   : 3,
      price : 300
    },
    {
      pid   : 5,
      price : 500
    }
  ]
];
list[0].name = "Langara";
list[1].name = "Oakridge";


const beforeData = [
  [
    {
      pid   : 1,
      price : 10
    },
    {
      pid   : 2,
      price : 20
    }
  ],
  [
    {
      pid   : 3,
      price : 30
    },
    {
      pid   : 4,
      price : 40
    }
  ]
];
beforeData[0].name = "Langara";
beforeData[1].name = "Oakridge";


// this function only checks whether the data before and current are the same
// if so, the system may not send the email because nothing has changed
isEqual = (before, current) => {
  let noChange = true;
  for (let c of current) {
    // console.log("### c", c);
    for (let b of before) {
      if (b.name === c.name) {
        // console.log("### b", b);
        // console.log("c.name", c.name);
        // console.log("c.length", c.length);
        for (let objC of c) {
          // console.log("objc", objC);
          let countC = 0;
          let countB = 0;
          for (let objB of b) {
            countB += 1;
            // console.log("objb", objB);
            // console.log("b.length", b.length);
            // countC += 1;
            if (objB.pid === objC.pid) {
              objB.flag = true;
              if (objB.price !== objC.price) {
                objC.modify = "Changed";
                noChange = false;
                // console.log("***difffff")
              }
              // console.log("=== same pid-BREAK");
              break;
            } else {
              countC += 1;
              if (countC === b.length) {
                noChange = false;
                objC.modify = "New";
                break;
              }
            }
          }
        }
        for (let objB of b) {
          // console.log("=> objB", objB);
          if (!objB.flag) {
            // console.log("DELETEDDDDDDDDDDD");
            objB.modify = "Deleted";
            noChange = false;
            c.push(objB);
          }
        }
      }
    }
  }
  return(noChange || current);
}

compareLists = (beforeData, list) => {
  console.log("###beforeData", beforeData);
  console.log("###current", list);
  return isEqual(beforeData, list);
  // const checkOne = isEqual(beforeData, list);
  // const checkTwo = isEqual(list, beforeData);
  // if ((checkOne === true) && (checkTwo === true)) return("sameData");
  if ((checkOne === true) ) return("sameData");
  // console.log("list", list);
  // let areTheSame = true;
  // for(let b in beforeData) {
  //     console.log("array=", beforeData[0]["name"]);
    // for(let bChild of beforeData[b]){
    //   console.log(bChild.price);
    //   // console.log(`obj${bChild}-> ${JSON.stringify(beforeData[b][bChild])}`);
    // }
  return("diff");
}

console.log(compareLists(beforeData, list));