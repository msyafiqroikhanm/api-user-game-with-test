const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "User Game API",
    description:
      "This is an API for the user games service. The technology used in this API is expressJs and Postgresql database. Made to fulfill the challenge 05 binary academy",
  },
  host: "localhost:3000",
  schemes: ["http"],
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./index.js"];

swaggerAutogen(outputFile, endpointsFiles, doc);
