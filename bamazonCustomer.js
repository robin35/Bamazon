//==============================================================================================================================
// Dependencies
//==============================================================================================================================

var mysql = require("mysql");
var inquirer = require("inquirer");
var colors = require('colors');

//==============================================================================================================================
// Create the connection information for the sql database
//==============================================================================================================================

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "1910",
  database: "bamazon_db"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  start();
  connection.end();
});



//==============================================================================================================================
// Functions
//==============================================================================================================================

function start() {
  connection.query("SELECT item_id, product_name, price FROM products", function(err, res) {
    if (err) throw err;

    console.log(res);

    inquirer
      .prompt([
        {
          name: "items",
          type: "rawlist",
          choices: function() {
            var itemsArray = [];
            for (var i = 0; i < res.length; i++) {
              itemsArray.push(res[i].item_id);
            }
            return itemsArray;
          },
          message: "Enter the ID of the product you would like to purchase"
        },
        {
          name: "units",
          type: "input",
          message: "How many units would you like to purchase?"
        }
      ])
      .then(function(answer) {
        
        var selectedItem;
        for (var i = 0; i < res.length; i++) {
          if (res[i].item_id === answer.choice) {
            selectedItem = res[i];
            console.log(selectedItem);
          }
        }
      })
    })
  };



// function selectProduct() {
//     inquirer
//       .prompt({
//         name: "id",
//         type: "input",
//         message: "Enter the ID of the product you would like to purchase",
//         choices: [
//           "Can this be linked to the DB?  If not, remove choices."
//         ]
//       })
//       .then(function(answer) {
//         switch (answer.action) {
//         case "Find songs by artist":
//           artistSearch();
//           break;
  
//         case "Find all artists who appear more than once":
//           multiSearch();
//           break;
  
//         case "Find data within a specific range":
//           rangeSearch();
//           break;
  
//         case "Search for a specific song":
//           songSearch();
//           break;
  
//         case "Find artists with a top song and top album in the same year":
//           songAndAlbumSearch();
//           break;
//         }
//       });
//   }
  
//   function unitsPurchased() {
//     inquirer
//       .prompt({
//         name: "units",
//         type: "input",
//         message: "How many units of (add product name here) would you like to purchase?"
//       })
//       .then(function(answer) {
//         var query = "SELECT position, song, year FROM top5000 WHERE ?";
//         connection.query(query, { artist: answer.artist }, function(err, res) {
//           for (var i = 0; i < res.length; i++) {
//             console.log("Position: " + res[i].position + " || Song: " + res[i].song + " || Year: " + res[i].year);
//           }
//           runSearch();
//         });
//       });
//   }
