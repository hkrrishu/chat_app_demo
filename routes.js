const fs = require("fs");

const requestHandler = (req, res) => {
  const url = req.url;
  const method = req.method;

  if (req.url === "/") {
    fs.readFile("message", (err, data) => {
      let messages = "";

      if (!err) {
        messages = data.toString();
      }

      res.setHeader("Content-Type", "text/html");

      res.end(`
            ${messages}

            <form action="/message" method="POST">
                <label>Message:</label>
                <input type="text" name="message">
                <button type="submit">Send</button>
            </form>
        `);
    });
  } else if (url === "/message") {
    // Response after clicking Add
    res.setHeader("Content-Type", "text/html");

    let body = [];
    req.on("data", (chunk) => {
      console.log(chunk);
      body.push(chunk);
    });
    req.on("end", () => {
      let buffer = Buffer.concat(body);

      console.log(buffer);
      let formData = buffer.toString();
      console.log(formData);

      let formValues = formData.split("=")[1];
      console.log(formValues);

      fs.appendFile("message", formValues + "<br>", (err) => {
        res.statusCode = 302; //redirected
        res.setHeader("Location", "/");
        res.end();
      });
    });
  } else {
    if (req.url === "/read") {
      //read from file
      fs.readFile("message", (err, data) => {
        console.log(data.toString());
        res.end(`
                    <h1>${data.toString()}</h1>
                `);
      });
    }
  }
};

const anotherFunction = () => {
  console.log("this is another function");
};

module.exports = {
  requestHandler,
  anotherFunction,
};
