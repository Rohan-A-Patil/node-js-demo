const http = require("http");
const mysql = require('mysql');

const PORT = process.env.PORT || 5000;

// Create a connection to the database
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root'
});

const server = http.createServer(async (req, res) => {
    if (req.url === "/test" && req.method === "GET") {
        console.log("Inside GET /test")
        var result;
        connection.query('select * from user_db.user', function (err, rows) {
            if (err) throw err
            result = JSON.stringify({ value: rows });
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(result);
        })
    }
    else if (req.url === "/test" && req.method === "POST") {
        console.log("Inside POST /test")
        const buffers = [];
        for await (const chunk of req) {
            buffers.push(chunk);
        }
        const data = JSON.parse(Buffer.concat(buffers).toString());
  
        const query = `insert into user_db.user (id,name,age,address)  values (${data.id},'${data.name}',${data.age},'${data.address}')`;
        connection.query(query, function (err) {
            if (err) throw err
            result = JSON.stringify({ value: data });
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(result)
        })
    }
    else {// No route present
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Route not found" }));
    }
});



//open the MySQL connection
connection.connect(error => {
    if (error) {
        console.log("A error has been occurred " + "while connecting to database.");
        throw error;
    }

    //If Everything goes correct, Then start Express Server
    server.listen(PORT, () => {
        console.log("Database connection is Ready and "
            + "Server is Listening on Port ", PORT);
    });
});