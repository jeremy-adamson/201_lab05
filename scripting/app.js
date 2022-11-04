'use strict';

const openingTime = '6am';
const closingTime = '8pm';
const numberOfOpenHours = twentyFourHour(closingTime) - twentyFourHour(openingTime);



// Converts time to 24 hour (military) time and keeps int datatype
function twentyFourHour(time){
    let stringTime = time.slice(0, time.length-2);
    let timeSuffix = time.slice(time.length-2, 4);
    let intTime = Number(stringTime);
    if (timeSuffix === 'am'){
        return (intTime);
    } else if (timeSuffix === 'pm' && intTime === 12){
        return (12);
    } else if (timeSuffix === 'pm'){
        return (intTime + 12);
    } else {
        console.log(`Something REALLY went wrong converting to 24 hour time`);
    }    
}

// Converts time to 12 hour (am/pm) time and returns string datatype
// Not currently setup for going past 11pm
function twelveHour(time){
    let intTime = Number(time);
    if (intTime < 12){
        return (`${intTime}am`);
    } else if (intTime === 12){
        return (`12pm`);
    } else if (intTime < 24){
        return (`${intTime - 12}pm`);
    } else {
        console.log ('Time error!!!');
    }
}

// Increments a given time (string) to the next hour
function incrementHour(time){
    time = twentyFourHour(time) + 1;
    return (twelveHour(time));
}

function predictHourlyCookies(customers, avePerCust){
    return(customers * avePerCust);
}

// Passed storeFront and storeFrontParametersType
function populateProjectedStoreSales(city, cityParameters){
    for (let i = 0; i < numberOfOpenHours; i++){
        let rawSales = 0;
        rawSales = predictHourlyCookies(predictHourlyCustomers(cityParameters), cityParameters.avgCookieSale);
        city.hourlyData[i].hrCookieSales = Math.round(rawSales);
        // return (Math.round(rawSales));
    }
}

// Passed storeFrontParameters type, return integer
function predictHourlyCustomers(cityParameters){
    let custRange = cityParameters.maxCustHr - cityParameters.minCustHr;
    let estimatedCustomers = Math.floor(Math.random() * (custRange + 1) + cityParameters.minCustHr);
    return estimatedCustomers;
}


// Main structure to store the given parameters for one particular location
const storeFrontParameters = {
    city: '',
    minCustHr: 0,
    maxCustHr: 0,
    avgCookieSale: 0
}



// Main structure for each particular store front to track sales by hour
// Contains location name, array of sales per hour, total cookies sold that day
class storeFront {
    constructor(location) {
        this.city = location;
        this.hourlyData = [];
        this.dailyCookieSales = 0;

        const hourData = {
            time: '',
            hrCookieSales: 0
        }
        
        let incrementalHour = openingTime;
        for (let i = 0; i < numberOfOpenHours; i++) {
            this.hourlyData[i] = Object.create(hourData);
            this.hourlyData[i].time = incrementalHour;
            incrementalHour = incrementHour(incrementalHour);
        }
    }

    // Calculates the sum of all the cookies sold that day and stores the value in the object
    tabulateTotalSales(){
        let summation = 0;
        for (let i = 0; i < this.hourlyData.length; i++){
            summation += this.hourlyData[i].hrCookieSales;
        }
        this.dailyCookieSales = summation;
    }

    // Prints location data to the console log
    printLocationToConsole(){

        console.log(this.city);
        for (let i = 0; i < this.hourlyData.length; i++){
            console.log(`${this.hourlyData[i].time}: ${this.hourlyData[i].hrCookieSales}`);
        }
        console.log(this.dailyCookieSales);
    }

    // Prints location data to HTML in an unordered list format
    printLocationULtoHTML(){
        const parentElement = document.getElementById("listPrintOut");

        const dividerTag = document.createElement('div');
        dividerTag.setAttribute('id', 'sideBySide');
        dividerTag.setAttribute('class', "grid-item");
        parentElement.appendChild(dividerTag);

        const listTitle = document.createElement('p');
        listTitle.setAttribute('id', 'location');
        listTitle.textContent = `Location: ${this.city}`;     
        dividerTag.appendChild(listTitle);

        const unorderedList = document.createElement('ul');
        dividerTag.appendChild(unorderedList);

        for (let i = 0; i < this.hourlyData.length; i++){
            const listItem = document.createElement('li');
            listItem.textContent = `${this.hourlyData[i].time}: ${this.hourlyData[i].hrCookieSales}`;
            unorderedList.appendChild(listItem);
        }

        const printTotal = document.createElement('p');
        printTotal.setAttribute('id', 'total');
        printTotal.textContent = `Total: ${this.dailyCookieSales}`;
        dividerTag.appendChild(printTotal);

    }

    // Prints location data to a table
    printLocationTableToHTML(){
    //  Method#1
    //     let parentElement = document.getElementById("listPrintOut");

    //     let makeATable = document.createElement('table');
    //     parentElement.appendChild(makeATable);

    //     let makeRow = document.createElement('tr');
    //     makeATable.appendChild(makeRow);

                
    //     let makeHeading1 = document.createElement('th');
    //     let makeHeading2 = document.createElement('th');
    //     makeHeading1.textContent = `Time`;
    //     makeRow.appendChild(makeHeading1);
    //     makeHeading2.textContent = `Cookies`;
    //     makeRow.appendChild(makeHeading2);


    //     for (let i = 0; i < this.hourlyData.length; i++){

    //         let tableData1 = document.createElement('td');
    //         let tableData2 = document.createElement('td');
    //         let tableRow = document.createElement('tr');

    //         tableData1.textContent = `${this.hourlyData[i].time}`;
    //         tableData2.textContent = `${this.hourlyData[i].hrCookieSales}`;

    //         tableRow.appendChild(tableData1);
    //         tableRow.appendChild(tableData2);

    //         makeATable.appendChild(tableRow);              
            
    //     }


    // Method#2
    //     // document.getElementById("header").innerHTML = `Location: ${this.city}`;
        
    //     // let stringToPrint = `<tr><th>Time</th><th>Cookies</th></tr>`;
    //     // for (let i = 0; i < this.hourlyData.length; i++){
    //     //     stringToPrint += `<tr><td>${this.hourlyData[i].time} </td><td> ${this.hourlyData[i].hrCookieSales}</td></tr>`;            
    //     // }
        
    //     // stringToPrint += `<tr><td> Total: </td> <td> ${this.dailyCookieSales} </td></tr>`;
    //     // document.getElementById("listPrintOut").innerHTML = `${stringToPrint}`;
    }
}


// Givens
let numberOfLocations = 5;
let allStoreFrontParameters = [];
let allLocationProjections = [];

for (let i = 0; i < numberOfLocations; i++){
    allStoreFrontParameters[i] = Object.create(storeFrontParameters);
}

allStoreFrontParameters[0] = {city: "Seattle", minCustHr: 23, maxCustHr: 65, avgCookieSale: 6.3};
allStoreFrontParameters[1] = {city: "Tokyo", minCustHr: 3, maxCustHr: 24, avgCookieSale: 1.2};
allStoreFrontParameters[2] = {city: "Dubai", minCustHr: 11, maxCustHr: 38, avgCookieSale: 3.7};
allStoreFrontParameters[3] = {city: "Paris", minCustHr: 20, maxCustHr: 38, avgCookieSale: 2.3};
allStoreFrontParameters[4] = {city: "Lima", minCustHr: 2, maxCustHr: 16, avgCookieSale: 4.6};


// Constructing the table of locations
for (let i = 0; i < numberOfLocations; i++){
    allLocationProjections[i] = new storeFront(allStoreFrontParameters[i].city);
}

// Populate the table of locations with projected data
for (let i = 0; i < numberOfLocations; i++){
    populateProjectedStoreSales(allLocationProjections[i], allStoreFrontParameters[i]);
    allLocationProjections[i].tabulateTotalSales();
}

// Print Locations in an unordered list
let cssColumnFormatting = '';
for (let i = 0; i < numberOfLocations; i++){
    allLocationProjections[i].printLocationULtoHTML();
    cssColumnFormatting += `auto `;
}
document.getElementById('listPrintOut').style.gridTemplateColumns = cssColumnFormatting;

