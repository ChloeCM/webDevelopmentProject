// Import the express module and create an instance of express to set up the server
const express = require("express");
const app = express();

// Import body-parser used for parsing the body ofincoming requests
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

//Import authentication module
const auth = require("./auth");

// Set EJS as the view engine for rendering pages
app.set("view engine", "ejs");

// Create two users for testing authentication
auth.createUser("user", "pass");

// Test the authentication function
console.log(auth.authenticateUser("user", "pass"));

//Connect to database:
const mysql = require("mysql");
//Create a connection to the MySQL database
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "g00425733",
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to database: ", err);
  } else {
    console.log("Connected to database!");
  }
});

// Serve static files from the public directory
app.use(express.static("home"));

// Route to handle login form submission
app.post("/login", function (req, res) {
  // Retrieve username and password from the input
  const username = req.body.username;
  const password = req.body.password;

  // Returns true if credentials are valid, false otherwise
  const authenticated = auth.authenticateUser(username, password);
  console.log(authenticated);

  // Check if authentication is successful
  if (authenticated) {
    console.log("You're In! Login was successful!!!");
    res.render("home");
  } else {
    console.log("Ooops!!! Login Failed! Try again!");
    res.render("failed");
  }
});

// Listens for GET requests to fetch product details.
app.get("/shop", function (req, res) {
  const ID = req.query.rec;
  // Fetches all columns from the productcamp table matching the ID
  connection.query(
    "SELECT * FROM productcamp WHERE ID = ?",
    [ID],
    function (err, rows, fields) {
      // Log errors
      if (err) {
        console.error("Error retrieving data from database: ", err);
        res.status(500).send("Error retrieving data from database");
      } else if (rows.length === 0) {
        console.error(`No rows found for ID ${ID}`);
        res.status(404).send(`No product found for ID ${ID}`);
      } else {
        console.log("Data retrieved from database!");
    

        // Get product details from the result set
        const prodName = rows[0].Product;
        const prodDescription = rows[0].Description;
        const prodImage = rows[0].Images;
        const price = rows[0].Price;

        res.render("test.ejs", {
          myMessage: prodName,
          description: prodDescription,
          myImages: prodImage,
          myPrice: price,
        });
      }
    }
  );
});

// Listens for POST requestions
app.post("/shop", function (req, res) {
  const ID = req.body.rec2;
  // Fetches all columns from the productcamp table matching the ID
  connection.query(
    "SELECT * FROM productcamp WHERE ID = ?",
    [ID],
    function (err, rows, fields) {
      // Checks for errors
      if (err) {
        console.error("Error retrieving data from database: ", err);
        res.status(500).send("Error retrieving data from database");
      } else if (rows.length === 0) {
        console.error(`No rows found for ID ${ID}`);
        res.status(404).send(`No product found for ID ${ID}`);
      } else {
        // Log details about retrieved products
        console.log("Data retrieved from database!");
        console.log(rows[0].Product);
        console.log(rows[0].Description);
        console.log(rows[0].Price);
        console.log(rows[0].Images);

        // Get the product name and description from the first row of the result
        const prodName = rows[0].Product;
        const prodDescription = rows[0].Description;
        res.render("test.ejs", {
          myMessage: prodName,
          description: prodDescription,
        });
      }
    }
  );
});

// Listens for GET requests for the home url and renders the page
app.get("/home", function (req, res) {
  res.render("home");
});

// Starts the Express server on port 3000
app.listen(3000, () => {
  console.log("Server started on port 3000");
});
