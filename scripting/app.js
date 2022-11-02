'use strict';

// Read off of a file
// Read a structure with
    // Location
    // Min Cust/hr
    // Max Cust/hr
    // Avg Cookies/Sale

// Random number selected within Min/Max range
// Each hour from 6am - 8pm
// Structure with Location, SalesArray, Total
// Array structure with time and sale

const openingTime = '6am';
const closingTime = '8pm';
const numberOfOpenHours = twentyFourHour(closingTime) - twentyFourHour(openingTime);

// const fs = require('fs')
// fs.readFile('data/citydata.txt', 'utf-8', (err, importedData) => {
//     if (err) throw err;
//     console.log(importedData);
// })


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
    }
}

// Passed storeFrontParameters type, return integer
function predictHourlyCustomers(cityParameters){
    let custRange = cityParameters.maxCustHr - cityParameters.minCustHr;
    let estimatedCustomers = Math.floor(Math.random() * custRange + 1 + cityParameters.minCustHr);
    return estimatedCustomers;
}



let storeFrontParameters = {
    city: '',
    minCustHr: 0,
    maxCustHr: 0,
    avgCookieSale: 0
}

let storeFront = {
    city: '',
    hourlyData: [],
    dailyCookieSales: 0,
    constructHourDataArray(){
        let incrementalHour = openingTime;
        for (let i = 0; i < numberOfOpenHours; i++){
            this.hourlyData[i] = Object.create(hourData);
            this.hourlyData[i].time = incrementalHour;
            incrementalHour = incrementHour(incrementalHour);
        }
        
    },
    tabulateTotalSales(){
        let summation = 0;
        for (let i = 0; i < this.hourlyData.length; i++){
            summation += this.hourlyData[i].hrCookieSales;
        }
        this.dailyCookieSales = summation;
    },
    printLocationToConsole(){

        console.log(this.city);
        for (let i = 0; i < this.hourlyData.length; i++){
            console.log(`${this.hourlyData[i].time}: ${this.hourlyData[i].hrCookieSales}`);
        }
        console.log(this.dailyCookieSales);
    },
    printLocationToHTML(){
        document.getElementById("header").innerHTML = `Location: ${this.city}`;
        
        let stringToPrint = `<tr><th>Time</th><th>Cookies</th></tr>`;
        for (let i = 0; i < this.hourlyData.length; i++){
            stringToPrint += `<tr><td>${this.hourlyData[i].time} </td><td> ${this.hourlyData[i].hrCookieSales}</td></tr>`;            
        }
        
        stringToPrint += `<tr><td> Total: </td> <td> ${this.dailyCookieSales} </td></tr>`;
        document.getElementById("listPrintOut").innerHTML = `${stringToPrint}`;
    }
}

let hourData = {
    time: '',
    hrCookieSales: 0
}

let numberOfLocations = 0;
let allStoreFrontParameters = []
let allLocationProjections = [];

// // Read from file here!!!
// let endOfRead = false;
// while (!endOfRead){
//      // *** READ FROM FILE HERE***
//     allStoreFrontParameters[numberOfLocations] = Object.create(storeFrontParameters);
//     allStoreFrontParameters[numberOfLocations].city = Seattle;
//     allStoreFrontParameters[numberOfLocations].minCustHr = 23;
//     allStoreFrontParameters[numberOfLocations].maxCustHr = 65;
//     allStoreFrontParameters[numberOfLocations].avgCookieSale = 6.3;
    
//     numberOfLocations++;
// }

    allStoreFrontParameters[numberOfLocations] = Object.create(storeFrontParameters);
    allStoreFrontParameters[numberOfLocations].city = "Seattle";
    allStoreFrontParameters[numberOfLocations].minCustHr = 23;
    allStoreFrontParameters[numberOfLocations].maxCustHr = 65;
    allStoreFrontParameters[numberOfLocations].avgCookieSale = 6.3;

    numberOfLocations++;


// Constructing the table of locations
for (let i = 0; i < numberOfLocations; i++){

    allLocationProjections[i] = Object.create(storeFront);
    allLocationProjections[i].constructHourDataArray();
    allLocationProjections[i].city = allStoreFrontParameters[i].city;
}

// Populate the table of locations with projected data
for (let i = 0; i < numberOfLocations; i++){
    populateProjectedStoreSales(allLocationProjections[i], allStoreFrontParameters[i]);
    allLocationProjections[i].tabulateTotalSales();
}

allLocationProjections[0].printLocationToHTML();




// function storeFrontParameters(city, minCustHr, maxCustHr, avgCookieSale){
//     this.city = city;
//     this.minCustHr = minCustHr;
//     this.maxCustHr = maxCustHr;
//     this.avgCookieSale = aveCookieSale;
// }

// function storeFront(city, salesStruct, totalSales){
//     this.city = city;
//     this.salesStruct = salesStruct;
//     this.totalSales = totalSales;
// }

// function salesStruct(time, sales){
//     this.time = time;
//     this.sales = sales;

// }

