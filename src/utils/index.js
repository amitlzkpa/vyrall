import moment from "moment";

export function convertToArray(refs) {
  let regArr = [];
  refs.forEach((r) => {
    let rD = r.data();
    rD.id = r.id;
    regArr.push(rD);
  });
  return regArr;
}

export function processToTimestamp(dateObject) {
  let ret = dateObject ? moment(dateObject) : null;
  return ret ? ret.format("MMM Do YYYY") : "-";
}

export function arrayUnion(arrA, arrB, fn) {
  arrA = arrA || [];
  arrB = arrB || [];
  let ret = [...new Set([...arrA, ...arrB])].filter((i) => !!i);
  return ret;
}

// ref: https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript
export function getHash(inp, mod = 1) {
  var hash = 0,
    i,
    chr;
  if (inp.length === 0) return hash;
  for (i = 0; i < inp.length; i++) {
    chr = inp.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash % mod);
}

export function randomNumber(min, max) {
  return Math.abs(Math.round(Math.random() * (max - min) + min));
}
