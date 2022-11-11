'use strict';

import locationStoreFronts from '../data/citydata.json' assert {type: 'json'};

// create location card

// print location
// print hours
// print address
// print telephone

function makeBox(storeToPrint) {
    let newBox = document.createElement("div");
    newBox.setAttribute("class", "locBox");

    newBox.innerHTML = `<p>Location: ${storeToPrint.city} <br>
                        Hours: ${storeToPrint.hours} <br>
                        Address: ${storeToPrint.address} <br>
                        Phone#: ${storeToPrint.phone}</p>`;
    return newBox;

}

let printOut = document.getElementById("locations");

for (let i = 0; i < locationStoreFronts.length; i++){
    printOut.appendChild(makeBox(locationStoreFronts[i]));
}