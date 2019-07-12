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
    inquirer
      .prompt({
        name: "selection",
        type: "list",
        message: "Menu Options:",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
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
          addItems();
        }
        else if(answer.selection === "Add New Product") {
          addNew();
        } else{
          connection.end();
        }
      });
  }


function listItems() {

}


function lowItems() {

}


function addItems() {

}


function addNew() {
    inquirer
    .prompt([
      {
        name: "item",
        type: "input",
        message: "What is the item you would like to submit?"
      },
      {
        name: "category",
        type: "input",
        message: "What category would you like to place your auction in?"
      },
      {
        name: "startingBid",
        type: "input",
        message: "What would you like your starting bid to be?",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      }
    ])
    .then(function(answer) {
      // when finished prompting, insert a new item into the db with that info
      connection.query(
        "INSERT INTO auctions SET ?",
        {
          item_name: answer.item,
          category: answer.category,
          starting_bid: answer.startingBid || 0,
          highest_bid: answer.startingBid || 0
        },
        function(err) {
          if (err) throw err;
          console.log("Your auction was created successfully!");
          // re-prompt the user for if they want to bid or post
          start();
        }
      );
    });
}
