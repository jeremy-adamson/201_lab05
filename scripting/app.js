'use strict';

// To Do:
//          Store additional field for scaled customers according to the curve instead of user prompt
//          Add button to allow the user to swap back and forth between applying the curve and not
//              Would require the button to refresh the page/table, unknown how to do this at this time
//          Add a json file with the initial store parameters and read from it
//              It works, but pretty sure that JSON.parse was supposed to be used and JS didn't like the method call (***ask later***)

const openingTime = '6am';
const closingTime = '8pm';
const numberOfOpenHours = twentyFourHour(closingTime) - twentyFourHour(openingTime);
const trafficCurve = [.5, .75, 1.0, .6, .8, 1.0, .7, .4, .6, .9, .7, .5, .3, .4, .6];
const allStoreFrontParameters = cityParam; // Import city data parameters/givens from attached JSON file


// Purpose: Converts time to 24 hour (military) format and keeps int datatype
// Input:   String of the time to be converted in 'XXam' or 'XXpm' format
// Return:  Int type of the 24 time

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

// Purpose: Converts time to 12 hour (am/pm) time and returns string datatype
// Input:   Int type only using the hour in 24 hour format (military)
// Return:  String version of the time in 12 hour format
// Note:    Not currently setup for going past 11pm

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


// Purpose: Increments a given time (string) to the next hour
// Input:   String in 12 hour format
// Return:  String in 12 hour format plus one hour

function incrementHour(time){
    time = twentyFourHour(time) + 1;
    return (twelveHour(time));
}


// Purpose: Given the customers and the cookies purchase per customer, calculates the cookies sold
// Input:   Number of customers and average number of cookies per customer
// Return:  Number of cookies purchased

function predictHourlyCookies(customers, avePerCust){
    return(customers * avePerCust);
}


// Purpose: Populate a particular StoreFront object with projected sales based upon given parameters
// Input:   StoreFront data type where the information is to be stored
//          cityParameters data type with the min/max customers per hour information
//          curveFlag boolean to indicate if the curve is to be taken into account
// Return:  None.  All StoreFront values are populated by reference

function populateProjectedStoreSales(city, cityParameters, curveFlag){
    let hourlyCustomers = 0;
    let rawSales = 0;
    let employees = 0;
    let curveCoefficient = 1;
   
    for (let i = 0; i < numberOfOpenHours; i++) {

        // If curve is to be applied, use the damping coefficient at the index
        // Otherwise coefficent remains at 1
        if (curveFlag){
            curveCoefficient = trafficCurve[i];
        }

        hourlyCustomers = predictHourlyCustomers(cityParameters, curveCoefficient);
        rawSales = predictHourlyCookies(hourlyCustomers, cityParameters.avgCookieSale);
        employees = predictEmployees(hourlyCustomers);        
                
        city.hourlyData[i].customers = hourlyCustomers;
        city.hourlyData[i].hrCookieSales = Math.round(rawSales);
        city.hourlyData[i].employees = employees;
    }
}


// Purpose: To predict the number of customers for that hour
// Input:   cityParameters object with information on the maximum and minimum customers per hour
//          curveCoefficient number to scale the number of customers as described by a given distribution per hour
// Return:  The estimated number of customers in integer value

function predictHourlyCustomers(cityParameters, curveCoefficient){
    let custRange = cityParameters.maxCustHr - cityParameters.minCustHr;
    let estimatedCustomers = Math.floor((Math.random() * (custRange + 1) + cityParameters.minCustHr) * curveCoefficient);
    return estimatedCustomers;
}


// Purpose: To predict the number of employees to staff the store with for a number of customers
// Input:   The number of customers for that hour
// Return:  The number of employees needed

function predictEmployees(hourlyCustomers){
    let employees = Math.ceil(hourlyCustomers / 20.0);
    if (employees < 2){
        employees = 2;
    }
    return employees;
}


// Main structure for each particular store front to track sales by hour
// Contains:
//          Location name (city)
//          Array of containing information for each hour such as time, cookie sales, customers, and employees needed
//          Total cookies sold that day (dailyCookieSales)
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


    // Purpose: To pass the proper flags indicating a cookie data row is to be printed to an HTML element
    // Input:   None
    // Return:  Table row element for cookies

    returnCookieTableDataElement(){
        return (this.printLocationHorizontalTableRowToHTML('tbody', 'hrCookieSales', true));
    }


    // Purpose: To pass the proper flags indicating an employee data row is to be printed to an HTML element
    // Input:   None
    // Return:  Table row element for employees needed

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




// Constructing the table of locations
let allLocationProjections = [];
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

// Prints out a table of employees needed
createTableOfEmployees(allLocationProjections);




// **************************************************************
// ***** Fun extra code below for educational purposes only *****
// **************************************************************

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