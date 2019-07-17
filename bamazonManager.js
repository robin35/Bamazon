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
        else if(answer.selection === "Add New Product") {
          addNew();
        } 
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

    inquirer
    .prompt([
      {
        name: "itemId",
        type: "rawlist",
        choices: function() {
          var itemsArray = [];
          for (var i = 0; i < res.length; i++) {
            itemsArray.push(res[i].item_id);
          }
          return itemsArray;
        },
        message: "\nSelect the ID of the product to which you would like to add inventory.".yellow
      },
      {
        name: "units",
        type: "input",
        message: "\nHow many units would you like to add?".yellow
      }
    ])
    .then(function(answer) {
      // Update the item in the db 
      for (var i = 0; i < res.length; i++) {
    
        if (res[i].item_id === answer.itemId) {
          
          var quantity = +res[i].stock_quantity + +answer.units;
          console.log("quantity", quantity);

          connection.query("UPDATE products SET ? WHERE ?",
            [
              {stock_quantity: quantity},
              {item_id: answer.itemId}
            ],
            function(err) {
              if (err) throw err;
              console.log("\nStock quantity was successfully updated.")
              displayMenu();
          });
        }
      }
    });
  });
};



function addNew() {
    
  connection.query("SELECT department_name FROM products GROUP BY department_name", function(err, res) {
    if (err) throw err;
    console.table(res);

    inquirer
    .prompt([
      {
        name: "dept",
        type: "rawlist",
        choices: function() {
          var itemsArray = [];
          for (var i = 0; i < res.length; i++) {
            itemsArray.push(res[i].department_name);
          }
          return itemsArray;
        },
        message: "\nEnter the department name."
      },
      {
        name: "item",
        type: "input",
        message: "Enter the product name."
      },
      {
        name: "price",
        type: "input",
        message: "Enter the price per unit.",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      },
      {
        name: "quantity",
        type: "input",
        message: "Enter the quantity.",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      }
    ])
    .then(function(answer) {
      //Insert the new item into the db
      connection.query(
        "INSERT INTO products SET ?",
        {
          product_name: answer.item,
          department_name: answer.dept,
          price: answer.price || 0,
          stock_quantity: answer.quantity || 0
        },
        function(err) {
          if (err) throw err;
          console.log("\nThe product was added successfully!".yellow);
          displayMenu();
        }
      );
    });
  });
}

function exitMenu() {
  connection.end();
};