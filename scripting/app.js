'use strict';

const openingTime = '6am';
const closingTime = '8pm';
const numberOfOpenHours = twentyFourHour(closingTime) - twentyFourHour(openingTime);
const trafficCurve = [.5, .75, 1.0,
                        .6, .8, 1.0,
                        .7, .4, .6,
                        .9, .7, .5,
                        .3, .4, .6]

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
function populateProjectedStoreSales(city, cityParameters, curveFlag){
    let hourlyCustomers = 0;
    let rawSales = 0;
    let employees = 0;
    let curveCoefficient = 1;

   
    for (let i = 0; i < numberOfOpenHours; i++) {

        if (curveFlag){
            curveCoefficient = trafficCurve[i];
        }

        hourlyCustomers = predictHourlyCustomers(cityParameters, curveCoefficient);
        rawSales = predictHourlyCookies(hourlyCustomers, cityParameters.avgCookieSale);

        console.log(hourlyCustomers);

        employees = Math.ceil(hourlyCustomers / 20.0);

        if (employees < 2){
            employees = 2;
        }
        
        city.hourlyData[i].hrCookieSales = Math.round(rawSales);
        city.hourlyData[i].customers = hourlyCustomers;
        city.hourlyData[i].employees = employees;
    }
}

// Passed storeFrontParameters type, return integer
function predictHourlyCustomers(cityParameters, curveCoefficient){
    let custRange = cityParameters.maxCustHr - cityParameters.minCustHr;
    let estimatedCustomers = Math.floor((Math.random() * (custRange + 1) + cityParameters.minCustHr) * curveCoefficient);
    return estimatedCustomers;
}


// Main structure to store the given parameters for one particular location
// const storeFrontParameters = {
//     city: '',
//     minCustHr: 0,
//     maxCustHr: 0,
//     avgCookieSale: 0
// }



// Main structure for each particular store front to track sales by hour
// Contains location name, array of sales per hour, total cookies sold that day
class StoreFront {
    constructor(city) {
        this.city = city;
        this.hourlyData = [];
        this.dailyCookieSales = 0;

        function HourData(time){
            this.time = time;
            this.hrCookieSales = 0;
            this.customers = 0;
            this.employees = 0;
        }
        
        let incrementalHour = openingTime;
        for (let i = 0; i < numberOfOpenHours; i++) {
            this.hourlyData[i] = new HourData(incrementalHour);
            incrementalHour = incrementHour(incrementalHour);
        }
    }

    // Purpose: Calculates the sum of all the cookies sold that day and stores the value in the object REQUIRED
    // Input:   None
    // Return:  None
    
    tabulateTotalSales(){
        let summation = 0;
        for (let i = 0; i < this.hourlyData.length; i++){
            summation += this.hourlyData[i].hrCookieSales;
        }
        this.dailyCookieSales = summation;
    }

    // Purpose: Prints StoreFront data to the console log
    // Input:   None
    // Return:  None
    printLocationToConsole(){

        console.log(this.city);
        for (let i = 0; i < this.hourlyData.length; i++){
            console.log(`${this.hourlyData[i].time}: ${this.hourlyData[i].hrCookieSales}`);
        }
        console.log(this.dailyCookieSales);
    }

    // Purpose: Prints location data to HTML in an unordered list format
    // Input:   None
    // Return:  None

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

    // Purpose: Nifty method which returns either a header, footer, or data table row as an element
    // Input:   rowType accepts `thead`, `tbody`, or `tfoot` to generate that type of table section
    //          property accepts table tags, either `th` or `td` to generate the type of row
    //          withTotal is a boolean which controls if the dailyCookieSales property is to be included in the row
    // Return:  A table row element of one StoreFront type
    
    printLocationHorizontalTableRowToHTML(rowType, property, withTotal){

        let htmlTag = 'td';

        if (rowType === 'thead' || rowType === 'tfoot'){
            htmlTag = 'th';
        }

        const tableSection = document.createElement(rowType);
        const tableRow = document.createElement('tr');
        tableSection.appendChild(tableRow);

        const tableCity = document.createElement(htmlTag);
        tableCity.textContent = this.city;
        tableRow.appendChild(tableCity);

        for (let i = 0; i < this.hourlyData.length; i++){
            const tableCookies = document.createElement(htmlTag);
            tableCookies.textContent = `${this.hourlyData[i][property]}`
            tableRow.appendChild(tableCookies);
        }

        if (withTotal){
            const tableTotal = document.createElement(htmlTag);
            tableTotal.textContent = `${this.dailyCookieSales}`;
            tableRow.appendChild(tableTotal);
        }

        return tableSection;
    }

    returnCookieTableDataElement(){
        return (this.printLocationHorizontalTableRowToHTML('tbody', 'hrCookieSales', true));
    }

    returnEmployeeTableDataElement(){
        return (this.printLocationHorizontalTableRowToHTML('tbody', 'employees', false));
    }
   
}


// Purpose: To generate a header row containing hour labels and returns a printable HTML header element
// Input:   None.  Requires array of store fronts ('allLocationProjections')
// Return:  Printable HTML table header element

function returnTableHeaderElement(withTotal){
    // Creation of top row on the Table
    let headerRowWithTimes = new StoreFront(`  `);
    headerRowWithTimes.dailyCookieSales = `Daily Location Total Cookies`;

    return headerRowWithTimes.printLocationHorizontalTableRowToHTML('thead', 'time', withTotal);
}

// Purpose: To generate a footer row containing the totals for each day and return a printable HTML footer element
// Input:   None.  Requires array of store fronts ('allLocationProjections')
// Return:  Printable HTML table footer element

function returnTableFooterElement(){
    // Creation of the totals row for each day
    let dailyAllLocationTotal = new StoreFront(`Totals`);
    for (let i = 0; i < numberOfOpenHours; i++) {
        let dailyAllTotal = 0;
        for (let j = 0; j < allLocationProjections.length; j++) {
            dailyAllTotal += allLocationProjections[j].hourlyData[i].hrCookieSales;
        }
        dailyAllLocationTotal.hourlyData[i].hrCookieSales = dailyAllTotal;
    }
    dailyAllLocationTotal.tabulateTotalSales();

    return dailyAllLocationTotal.printLocationHorizontalTableRowToHTML('tfoot', 'hrCookieSales', true);
}


// Purpose: To ask the user if they wish to apply the control curve
// Input:   None
// Return:  A boolean value

function askIfCurve(){
    let ans = prompt(`Do you wish to apply a customer traffic curve (y/n)? `);
    ans = ans.toLowerCase();

    while (ans !== `y` && ans !== `n`){
        alert(`Invaid input`);
        ans = prompt(`Do you wish to apply a customer traffic curve (y/n)? `);
        ans = ans.toLowerCase();
    }

    if (ans === `y`){
        return true;
    } else if (ans === `n`) {
        return false;
    } else {
        alert(`Something went wrong with the code.`)
    }    
}

// Purpose: To print out the cookies sold at each location per hour
// Input:   An array containing all of the storefronts
// Return:  None
function createTableOfSales(allLocationProjections){
    // Table Setup
    let tableParent = document.getElementById("listPrintOut");
    let tableElement = document.createElement('table');
    tableParent.appendChild(tableElement);

    // Print Header to Table
    let topRowToAppend = returnTableHeaderElement(true);
    tableElement.appendChild(topRowToAppend);

    // Print Data to Table
    for (let i = 0; i < allLocationProjections.length; i++) {
        let rowToAppend = allLocationProjections[i].returnCookieTableDataElement();
        tableElement.appendChild(rowToAppend);
    }

    // Print Footer to Table
    let totalsRowToAppend = returnTableFooterElement();
    tableElement.appendChild(totalsRowToAppend);
}

// Purpose: To print out the employees working at each location per hour
// Input:   An array containing all of the storefronts
// Return:  None
function createTableOfEmployees(allLocationProjections){
    // Table Setup
    let tableParent = document.getElementById("employeeTable");
    let tableElement = document.createElement('table');
    tableParent.appendChild(tableElement);

    // Print Header to Table
    let topRowToAppend = returnTableHeaderElement(false);
    tableElement.appendChild(topRowToAppend);

    // Print Data to Table
    for (let i = 0; i < allLocationProjections.length; i++) {
        let rowToAppend = allLocationProjections[i].returnEmployeeTableDataElement();
        tableElement.appendChild(rowToAppend);
    }

}

// Setup for arrays containing multiple stores
let allStoreFrontParameters = [];
let allLocationProjections = [];

// Personal stretch goal, to have the following information in a json file and have the script read from that
allStoreFrontParameters[0] = {city: "Seattle", minCustHr: 23, maxCustHr: 65, avgCookieSale: 6.3};
allStoreFrontParameters[1] = {city: "Tokyo", minCustHr: 3, maxCustHr: 24, avgCookieSale: 1.2};
allStoreFrontParameters[2] = {city: "Dubai", minCustHr: 11, maxCustHr: 38, avgCookieSale: 3.7};
allStoreFrontParameters[3] = {city: "Paris", minCustHr: 20, maxCustHr: 38, avgCookieSale: 2.3};
allStoreFrontParameters[4] = {city: "Lima", minCustHr: 2, maxCustHr: 16, avgCookieSale: 4.6};


// Constructing the table of locations
for (let i = 0; i < allStoreFrontParameters.length; i++){
    allLocationProjections[i] = new StoreFront(allStoreFrontParameters[i].city);
}

// Ask if the user wishes to apply the customer curve
let applyCurve = askIfCurve();

// Populate the table of locations with projected data
for (let i = 0; i < allStoreFrontParameters.length; i++){
    populateProjectedStoreSales(allLocationProjections[i], allStoreFrontParameters[i], applyCurve);
    allLocationProjections[i].tabulateTotalSales();
}

// Prints out a table of sales
createTableOfSales(allLocationProjections);

// Prints out a table of sales
createTableOfEmployees(allLocationProjections);







// Print Footer to Table
// totalsRowToAppend = returnTableFooterElement();
// tableElement.appendChild(totalsRowToAppend);

// Print Locations in an unordered list
// let cssColumnFormatting = '';
// for (let i = 0; i < allStoreFrontParameters.length; i++){
//     allLocationProjections[i].printLocationULtoHTML();
//     cssColumnFormatting += `auto `;
// }
// document.getElementById('listPrintOut').style.gridTemplateColumns = cssColumnFormatting;


// ***** Fun extra code for educational purposes only *****

    // Prints location data to a table
    // printLocationVerticalTableToHTML(){
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
    // }