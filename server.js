import { createServer } from "http";

const PORT = process.env.port || 8000;

let users = [
  { id: 1, name: "Omoyeni Omowunmi", customers: 2000 },
  { id: 2, name: "Rasheed Habeebat", customers: 1000 },
  { id: 3, name: "Mmereole-Basil Princess", customers: 1500 },
];

const server = createServer((req, res) => {
  //Set Headers
  res.setHeader("Content-Type", "application/json");

  //Route: GET /api/users
  if (req.url === "/api/users" && req.method === "GET") {
    res.write(JSON.stringify(users));
    res.end();
  } else if (req.url.match(/^\/api\/users\/\d+$/) && req.method === "GET") {
    const id = parseInt(req.url.split("/")[3]); // ✅ Fixed here
    const user = users.find((u) => u.id === id);

    if (user) {
      res.write(JSON.stringify(user));
    } else {
      res.statusCode = 404; // ✅ Better status code for "not found"
      res.write(JSON.stringify({ message: "User not found" }));
    }
    res.end();
  }

  //Route: POST /api/users
  else if (req.url === "/api/users" && req.method === "POST") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      const { name, customers } = JSON.parse(body);
      const newUser = { id: Date.now(), name, customers };

      users.push(newUser);

      res.statusCode = 201;
      res.write(JSON.stringify(newUser));
      res.end();
    });
  }

  //Route: DELETE /api/users/:id
  else if (req.url.match(/^\/api\/users\/\d+$/) && req.method === "DELETE") {
    const id = parseInt(req.url.split("/")[3]);
    const userIndex = users.findIndex((u) => u.id === id);

    if (userIndex > -1) {
      users.splice(userIndex, 1);
      res.write(JSON.stringify({ message: "User deleted" }));
    } else {
      res.statusCode = 404;
      res.write(JSON.stringify({ message: "User not found" }));
    }
    res.end();
  } else {
    res.statusCode = 404;
    res.write(JSON.stringify({ message: "Route not found" }));
    res.end();
  }
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
