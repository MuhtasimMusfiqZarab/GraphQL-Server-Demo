const express = require('express');
//glue layer between graphQl and express
const expressGraphQL = require('express-graphql');
const app = express();

//registering graphql with express -
app.use(
  '/graphql',
  // has configaration object
  expressGraphQL({
    //graphiql is a development tool that allows us to make queries against ou development server
    graphiql: true,
  })
);

app.listen(5000, () => {
  console.log('Listening to port 5000');
});
