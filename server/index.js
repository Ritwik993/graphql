const express = require("express");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const bodyParser = require("body-parser");
const cors = require("cors");
const { default: axios } = require("axios");

async function startServer() {
  const app = express();
  const server = new ApolloServer({
    typeDefs: `
    type Todo{
       id:ID!
       title:String!
       completed:Boolean
    }
       type Query{
       getTodos:[Todo]
       }
    `,
    resolvers: {
      Query: {
        //getTodos: () => [{ id: 1, title: "Something", completed: false }],
        getTodos:async()=>(await axios.get("https://jsonplaceholder.typicode.com/todos")).data
      },
    },
  });
  app.use(bodyParser.json());
  app.use(cors());

  await server.start();
  app.use("/graphql", expressMiddleware(server));

  app.listen(8000, () => {
    console.log("Server started at PORT 8000");
  });
}

startServer();

/*
 * express ke andaar ham routes create karte hai
 * yaha par ham schema se mention karte hai kya query kar rahe hai
 * resolvers dena compulsory hai
 * typeDefs dena compulsory hai
 */

/*
 * Agar hame Graphql server se kuch bhi fetch karna hai toh ham query karte hai
 * Agar server mai kuch add karna hai toh ham mutation karte hai
 */

/*
 * Hamlog logic likhte hai resolver ke andar
*

query GETTodos{
  getTodos {
    title
    completed
  }
}

* Ham jis order mai data fetch karte ush order mai data aah raha hai
 */
