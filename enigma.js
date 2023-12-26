const { readFileSync } = require('fs');

const maxVal = 65+26;
//Simple enigma encoder/decoder

//Rotors
//Front mapping cables
//Input from file

//I read one char from the input, it goes 
/*
    front cables 
    to the 1 rotor
    to the 2 rotor
    to the 3 rotor
    back to the 2 rotor
    back to the 1 rotor
    front cable
    encoded letter

    first rotor rotated by 1
    check if needed to rotate 2 rotor
    check if needed to rotate 3 rotor    
*/

//The front cable is a map that change the letter parsed/pressed if present
let frontCables = {
    'A':'D',
    'B':'C'
}

function passInCables(letter, frontCable, mode) {
    if (mode === "encode") {
      return frontCable[letter] || letter;
    }
    if (mode === "decode") {
      let vals = Object.values(frontCable);
      let keys = Object.keys(frontCable);
  
      let id = vals.findIndex(ele => ele === letter);
      return id != -1 ? keys[id] : letter;
    }
}

//The big problem was the Deflector(fixedRotor) that needs to be mapped similar to the cables, instead of random, eg (A->V, V->A, X->B, B->X) 
function rotateRotors(rot1, rot2, rot3) {

  if (rot1.currentPos >= 26) {
    if (rot2.currentPos >= 26) {
      rot3.currentPos++;
      rot3.currentPos %= 26;

      rotateMap(rot3.map);
    }

    rot2.currentPos++;
    rot2.currentPos %= 26;

    rotateMap(rot2.map);
  }

  rot1.currentPos++;
  rot1.currentPos %= 26;
  rotateMap(rot1.map);
}

function rotateMap(rot) {

  let keyList = Object.keys(rot);
  let valuesArray = Object.values(rot);
  valuesArray.push(valuesArray.shift());

  for(let i = 0; i<keyList.length; i++) {

    rot[keyList[i]] = valuesArray[i];
  }
}

let configFile = process.argv[2];
let mode = process.argv[3];
let text = process.argv[4];

console.log("configFile:", configFile);
console.log("mode:", mode);
console.log("text:", text);

const data = readFileSync(configFile);
if (data) {
  let enigmaConfig = JSON.parse(data);

  let rot1Conf = enigmaConfig.rotorsSettings.rotor1
  let rot2Conf = enigmaConfig.rotorsSettings.rotor2
  let rot3Conf = enigmaConfig.rotorsSettings.rotor3

  let rotor1 = {
    currentPos : 0,
    map : enigmaConfig.rotors[rot1Conf.id],
    ...rot1Conf
  }

  let rotor2 = {
    currentPos : 0,
    map : enigmaConfig.rotors[rot2Conf.id],
    ...rot2Conf
  }

  let rotor3 = {
    currentPos : 0,
    map : enigmaConfig.rotors[rot3Conf.id],
    ...rot3Conf
  }

  let fixedRotor = {
    currentPos : 0,
    map : enigmaConfig.fixedRot
  }

  let cables = enigmaConfig.cablesMap;

  let finalString = "";
  //Test translating a text
  for(let i=0; i<text.length; i++) 
  {
    let char = text[i];
    let asciiCode = text.charCodeAt(i)

    if ( asciiCode < 65 || asciiCode > maxVal) {
      finalString += char;
    }
    else {
      finalString += applyEnigma(char, mode, rotor1, rotor2, rotor3, fixedRotor, cables);
      rotateRotors(rotor1, rotor2, rotor3);
    }
  }
  console.log("message:", finalString);
}

function passInRotor(char, rotor, mode) {
  if (mode === "encode") {
    return rotor.map[char]
  }
  if (mode === "decode") {
    let vals = Object.values(rotor.map);
    let keys = Object.keys(rotor.map);

    let id = vals.findIndex(ele => ele === char);
    return keys[id];
  }
}

function applyEnigma(char, mode, rotor1, rotor2, rotor3, fixedRotor, cables) {
  // console.log("cables enter:", char);
  char = passInCables(char, cables, mode);
  // console.log("rot1 enter:", char);
  char = passInRotor(char, rotor1, mode);
  // console.log("rot2 enter :", char);
  char = passInRotor(char, rotor2, mode);
  // console.log("rot3 enter :", char);
  char = passInRotor(char, rotor3, mode);
  // console.log("fixed enter :", char);
  char = passInRotor(char, fixedRotor, mode)
  // console.log("rot3 enter :", char);
  char = passInRotor(char, rotor3, mode);
  // console.log("rot2 enter :", char);
  char = passInRotor(char, rotor2, mode);
  // console.log("rot1 enter :", char);
  char = passInRotor(char, rotor1, mode);
  // console.log("cables enter :", char);
  char = passInCables(char, cables, mode);
  // rotateRotors(rotor1, rotor2, rotor3);
  return char;
}