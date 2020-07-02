//contains all the knowledge required for telling graphql exactly what your app data looks like(what properties each object has and how each object is related to each other)
const graphql = require('graphql');
const axios = require('axios');
const {
  //this instructs graphql about the presence of a user in our app(an idea of the user)
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
} = graphql;

//CompanyType needs to be before the UserType
const CompanyType = new GraphQLObjectType({
  name: 'Company',
  //field uses arrow function for circular references issues
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    //associates all the users with the company who are working here
    users: {
      // we have many users in a single company
      // we need to tell graphql that it is going to get a list of users
      type: new GraphQLList(UserType),
      resolve(parentValue, args) {
        return axios
          .get(`http://localhost:3000/companies/${parentValue.id}/users`)
          .then((res) => res.data);
      },
    },
  }),
});

//UserType object instructs grpahql about what a user object looks like
//type of data which is UserType
const UserType = new GraphQLObjectType({
  //1st two are qruied properties
  name: 'User',
  //we also can use arrow function here for circular reference , but no need to use
  fields: {
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
    //associate a company with a user
    company: {
      type: CompanyType,
      //resolve to let graphql find a company that is associated with a given user
      //teach graphql how to walk from a user to a company
      //resolve resolves the difference between the incoming JSON/data model (companytId) and the actual data type we are trying to use here(company)
      resolve(parentValue, args) {
        //resolve comnay with a user
        return axios
          .get(`http://localhost:3000/companies/${parentValue.companyId}`)
          .then((res) => res.data);
      },
    },
  },
});

// we need to give graphql a root query which allows us to jump in to a specific node in our graph of data
//example (give the user of the id of 23)
//entry point of our application/data

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: {
        id: { type: GraphQLString },
      },
      // the resolve function is where we actually go to our database & find the data we are looking for
      //parentvalue - not ever used //arg is what we care about
      resolve(parentValue, args) {
        //return user with the given id inside the args
        //calling to json server
        return axios
          .get(`http://localhost:3000/users/${args.id}`)
          .then((response) => response.data)
          .catch((e) => console.log(e));
      },
    },
    company: {
      type: CompanyType,
      args: {
        id: { type: GraphQLString },
      },
      resolve(parentValue, args) {
        return axios
          .get(`http://localhost:3000/companies/${args.id}`)
          .then((response) => response.data)
          .catch((e) => console.log(e));
      },
    },
  },
});

//GraphQLSchema takes in a root query & returns a graphl schema instance
module.exports = new GraphQLSchema({
  query: RootQuery,
});
