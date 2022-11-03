
# Database laboratory

Database laboratory, where a dataset related to COVID-19 data is used, this dataset has more than 200k rows, with this data, graphs are created to visualize data such as deaths, cases and vaccination.

## Features

- Different types of charts for data visualization
- Graphics of the map for better visualization of each country
- Responsive web app
- easy to use


## Installation

The first thing to do is to type the following command:

```bash
  npm install
```

This will download all the dependencies and packages used in the program. Then you need to install the database, the same file where the web application is located, has the script to create the database, but for simplicity, there is another separate file with only the script to create the database. The same is done here by executing the command "npm install" and then "npm start" to create the database.
Node JS has a problem with memory usage, so for the correct execution of the script that creates the database you must use the following command:

```bash
node --max-old-space-size=4096 index.js
```    

To run the web application, type the following command:
```bash
npm start
``` 
## Deployment

The web application when querying a database with a lot of data, it tends to get slow, so we decided to create a second database, which would be a partial database, where instead of saving each day as a record in the database, we only save the days 1, 10, 20 and 30 of each month.


[Web application using the complete database:](https://laboratoriobasesdedatos.azurewebsites.net)

[Web application using the partial database:](https://laboratoriobasededatosv2.azurewebsites.net)

## Support

For support, email licerol@uninorte.edu.co


## 🛠 Skills
Javascript, HTML, CSS, Chart JS, Node JS, Express JS, MongoDB
