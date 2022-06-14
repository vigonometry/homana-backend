import { createModule, gql } from "graphql-modules";
import { readClaim, readClaims } from "../db_functions/Claim.js";
import { createClient } from "../db_functions/Client.js";
import { readPoliciesTaken, readPolicyTaken } from "../db_functions/PolicyTaken.js";

export const ClientModule = createModule({
  id: "client",
  typeDefs: gql`
    type Client implements User {
      _id: ID!
      email: ID
      password: String
      dependants: [ID!]!
      policies: [PolicyTaken!]!
      claims: [Claim!]!
    }

    type Query {
      readPoliciesTaken: [PolicyTaken!]! #resolver field
      readPolicyTaken(policyId: ID!): PolicyTaken #resolver field
      readClaims: [Claim!]! #resolver field
      readClaim(_id: ID!): Claim
    }

    type Mutation {
      createClient(
        _id: String!
        email: String
        password: String
        dependants: [String!]!
      ): HTTPResponse
    }
  `,
  resolvers: {
    Query: {
      readPoliciesTaken: readPoliciesTaken(),
      readPolicyTaken: (_, args) => readPolicyTaken(args),
      readClaims: readClaims(),
      readClaim: (_, args) => readClaim(args),
    },
    Mutation: {
      createClient: (_, args) => createClient(args),
    },
  },
});
