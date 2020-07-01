//contains all the knowledge required for telling graphql exactly what your app data looks like(what properties each object has and how each object is related to each other)
const graphql = require('graphql');
const {
  //this instructs graphql about the presence of a user in our app(an idea of the user)
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
} = graphql;

//UserType object instructs grpahql about what a user object looks like
const UserType = new GraphQLObjectType({
  //1st two are qruied properties
  name: 'User',
  fields: {
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
  },
});
