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
      price : 30
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
    }
  ]
];
beforeData[0].name = "Langara";
beforeData[1].name = "Oakridge";

isEqual = (before, current) => {
  for (let b in before)
    for (let c in current)
      if (current[c].name === before[b].name)
        for (let objB of before[b]) {
          let count = 0;
          for (let objC in current[c]) {
            count += 1;
            if (objB.pid === current[c][objC].pid)
              break;
            else
              if (count === current[c].length)
                return false;
          }
        }
  return true;
}

compareLists = (beforeData, list) => {
  console.log("###beforeData", beforeData);
  console.log("###list", list);
  const checkOne = isEqual(beforeData, list);
  const checkTwo = isEqual(list, beforeData);
  if ((checkOne === true) || (checkTwo === true)) return("same");
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