//contains all the knowledge required for telling graphql exactly what your app data looks like(what properties each object has and how each object is related to each other)
const graphql = require('graphql');
const _ = require('lodash');
const {
  //this instructs graphql about the presence of a user in our app(an idea of the user)
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
} = graphql;

//here are the hard coded list of users
const users = [
  {
    id: '23',
    firstName: 'Bill',
    age: 20,
  },
  {
    id: '47',
    firstName: 'Samantha',
    age: 21,
  },
];

//UserType object instructs grpahql about what a user object looks like
//type of data which is UserType
const UserType = new GraphQLObjectType({
  //1st two are qruied properties
  name: 'User',
  fields: {
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
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
        return _.find(users, { id: args.id });
      },
    },
  },
});

//GraphQLSchema takes in a root query & returns a graphl schema instance
module.exports = new GraphQLSchema({
  query: RootQuery,
});
