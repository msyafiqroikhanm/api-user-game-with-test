const express = require("express");
const app = express();
const port = 3000;
const errorHandler = require("./utils/errorHandler");
const routes = require("./routes");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(routes);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`History Game App listening on port ${port}`);
});
