import { createModule, gql } from "graphql-modules";
import { readClaim, readClaims } from "../db_functions/Claim.js";
import { createClient } from "../db_functions/Client.js";
import { readPolicies, readPolicy } from "../db_functions/Policy.js";

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
      readPolicies: [PolicyTaken!]! #resolver field
      readPolicy(policyId: ID!): PolicyTaken #resolver field
      readClaims: [Claim!]! #resolver field
      readClaim(_id: ID!): Claim
    }

    type Mutation {
      createClient(
        _id: ID!
        email: ID
        password: String
        dependants: [ID!]!
      ): HTTPResponse
    }
  `,
  resolvers: {
    Query: {
      readPolicies: readPolicies(),
      readPolicy: (_, args) => readPolicy(args),
      readClaims: readClaims(),
      readClaim: (_, args) => readClaim(args),
    },
    Mutation: {
      createClient: (_, args) => createClient(args),
    },
  },
});
