import { createModule, gql } from "graphql-modules";
import { createPolicy, deletePolicy, updatePolicy } from "../db_functions/Policy.js";

export const PolicyModule = createModule({
  id: "policy",
  typeDefs: gql`
    type Policy {
      _id: ID!
      title: String!
      brokerId: ID!
      type: String!
      insuredAmount: Float!
    }

    type Mutation {
      createPolicy(
        _id: String!
        title: String!
        brokerId: String!
        type: String!
        insuredAmount: Float!
      ): HTTPResponse
      updatePolicy(_id: ID!, insuredAmount: String!): HTTPResponse
      deletePolicy(_id: ID!): HTTPResponse
    }
  `,
  resolvers: {
    Mutation: {
      createPolicy: (_, args, context) =>
        createPolicy({ ...args, clientId: context._id }),
      updatePolicy: async (_, args) =>
        updatePolicy({_id: args._id}, args),
      deletePolicy: (_, args) => deletePolicy(args),
    },
  },
});
