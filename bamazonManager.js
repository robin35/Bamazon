//==============================================================================================================================
// Dependencies
//==============================================================================================================================

var mysql = require("mysql");
var inquirer = require("inquirer");
var colors = require('colors');
var formatCurrency = require('format-currency');

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
  
  displayMenu();
  
 
});



//==============================================================================================================================
// Functions
//==============================================================================================================================

function displayMenu() {
    inquirer
      .prompt({
        name: "selection",
        type: "rawlist",
        message: "\nMenu Options: ",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit Menu"]
      })
      .then(function(answer) {
        // based on their answer, either call the bid or the post functions
        if (answer.selection === "View Products for Sale") {
          listItems();
        }
        else if(answer.selection === "View Low Inventory") {
          lowItems();
        }
        else if (answer.selection === "Add to Inventory") {
          addInv();
        }
        // else if(answer.selection === "Add New Product") {
        //   addNew();
        //} 
        else if(answer.selection === "Exit Menu") {
          exitMenu();
        };
      });
}


function listItems() {
  connection.query("SELECT item_id, product_name, CONCAT('$', FORMAT(price,2)) as price, stock_quantity FROM products", function(err, res) {
    if (err) throw err;
    console.table(res);
    displayMenu();
  });
}


function lowItems() {
  connection.query("SELECT item_id, product_name, CONCAT('$', FORMAT(price,2)) as price, stock_quantity FROM products WHERE stock_quantity < 5", function(err, res) {
    if (err) throw err;
    console.table(res);
    displayMenu();
  });
}


function addInv() {
  connection.query("SELECT item_id, product_name, stock_quantity FROM products", function(err, res) {
    if (err) throw err;

    console.table(res);
    displayMenu();
  });

  inquirer
  .prompt([
    {
      name: "item",
      type: "rawlist",
      choices: function() {
        var itemsArray = [];
        for (var i = 0; i < res.length; i++) {
          itemsArray.push(res[i].item_id);
        }
        return itemsArray;
      },
      message: "\nSelect a product to add inventory".yellow
    },
    {
      name: "units",
      type: "input",
      message: "\nHow many units would you like to add?".yellow
    }
  ])
  .then(function(answer) {

    for (var i = 0; i < res.length; i++) {
      var itemId = res[i].item_id;
      if (itemId === answer.item) {
        connection.query("UPDATE products SET stock_quantity = stock_quantity "+answer.units+" WHERE item_id ="+answer.item, function(err, res) {
          if (err) throw err;
        });
      }
    }
    connection.query("SELECT item_id, product_name, stock_quantity FROM products WHERE item_id ="+answer.item, function(err, res) {
      if (err) throw err;
      console.log("The inventory was successfully updated.")
      console.table(res);
      displayMenu();
    });

  });


}





// function addNew() {
//     inquirer
//     .prompt([
//       {
//         name: "item",
//         type: "input",
//         message: "What is the item you would like to submit?"
//       },
//       {
//         name: "category",
//         type: "input",
//         message: "What category would you like to place your auction in?"
//       },
//       {
//         name: "startingBid",
//         type: "input",
//         message: "What would you like your starting bid to be?",
//         validate: function(value) {
//           if (isNaN(value) === false) {
//             return true;
//           }
//           return false;
//         }
//       }
//     ])
//     .then(function(answer) {
//       // when finished prompting, insert a new item into the db with that info
//       connection.query(
//         "INSERT INTO auctions SET ?",
//         {
//           item_name: answer.item,
//           category: answer.category,
//           starting_bid: answer.startingBid || 0,
//           highest_bid: answer.startingBid || 0
//         },
//         function(err) {
//           if (err) throw err;
//           console.log("Your auction was created successfully!");
//           // re-prompt the user for if they want to bid or post
//           start();
//         }
//       );
//     });
// }

function exitMenu() {
  connection.end();
};