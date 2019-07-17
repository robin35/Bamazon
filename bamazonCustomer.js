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
  
  selectProduct(); 

});


//==============================================================================================================================
// Select Product Function
//==============================================================================================================================

function selectProduct() {
  console.log("Welcome to BAMAZON! Your high-end AMAZON!\n".yellow);
  
  connection.query("SELECT item_id, product_name as Description, CONCAT('$', FORMAT(price,2)) as Price FROM products", function(err, res) {
    if (err) throw err;
    console.table(res);

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
        message: "\nSelect the ID of the product you would like to purchase.".yellow
      },
      {
        name: "units",
        type: "input",
        message: "\nHow many units would you like to purchase?".yellow
      }
    ])
    .then(function(answer) {
      var itemSelected;
      for (var i = 0; i < res.length; i++) {
        var itemId = res[i].item_id;
        if (itemId === answer.item) {
          itemSelected = answer.item;
          console.log("\nYou selected: ".yellow);
          console.table(res[i]);
        }
      }
      var units = answer.units;

      finalizeSale(itemSelected,units);
    })
  })
}
  

//==============================================================================================================================
// Finalize Sale Function
//==============================================================================================================================

function finalizeSale(itemSelected,units) {

  connection.query("SELECT item_id, product_name, price, stock_quantity FROM products WHERE item_id = "+itemSelected, function(err, res) {
    if (err) throw err;

    var quantity = res[0].stock_quantity;

    if(units > quantity){
      console.log("\nInsufficient quantity! Try again.".red);
    }

    if(units <= quantity){
      var newInv = quantity - units;
      connection.query("UPDATE products SET stock_quantity = "+newInv+" WHERE item_id = "+itemSelected, function(err, res2) {
      });

      var total = units*res[0].price;
      var tax = total * .0825;
      var opts = { format: '%s%v %c', code: 'USD', symbol: '$' }

      console.log("\nYou purchased: ".yellow);
      console.log("\nItem ID: ".green, itemSelected);
      console.log("Description: ".green, res[0].product_name);
      console.log("Price: ".green, formatCurrency(res[0].price, opts));
      console.log("Quantity: ".green, units);
      console.log("Total: ".green, formatCurrency(total, opts));
      console.log("Sales tax (8.25%): ".green, formatCurrency(tax, opts));
      console.log("Total Due: ".green, formatCurrency(total+tax, opts));
    }

  console.log("\nThank you for shopping at Bamazon!".yellow);

  connection.end();

});
}
