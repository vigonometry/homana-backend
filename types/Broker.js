import { createModule, gql } from "graphql-modules";
import { readAgent, readAgents } from "../db_functions/Agent.js";
import { createBroker } from "../db_functions/Broker.js";
import { readClaim, readClaims } from "../db_functions/Claim.js";
import { readClient, readClients } from "../db_functions/Client.js";
import { readPolicies, readPolicy } from "../db_functions/Policy.js";

export const BrokerModule = createModule({
  id: "broker",
  typeDefs: gql`
    type Broker implements User {
      _id: ID!
      email: ID!
      password: String!
      agents: [Agent!]!
      clients: [Client!]!
      policies: [Policy!]!
      claims: [Claim!]!
    }

    type Query {
      readAgents: [Agent!]! #resolver field
      readAgent(_id: ID!): Agent #resolver field
      readClients: [Client!]! #resolver field
      readClient(_id: ID!): Client #resolver field
      readPolicies: [Policy!]! #resolver field
      readPolicy(_id: ID!): Policy #resolver field
      readClaims: [Claim!]! #resolver field
      readClaim(_id: ID!): Claim #resolver field
    }

    type Mutation {
      createBroker(_id: String!, email: String!, password: String!): HTTPResponse
    }
  `,
  resolvers: {
    Query: {
      readAgents: readAgents(),
      readAgent: (_, args) => readAgent(args),
      readClients: readClients(),
      readClient: (_, args) => readClient(args),
      readPolicies: readPolicies(),
      readPolicy: (_, args) => readPolicy(args),
      readClaims: readClaims(),
      readClaim: (_, args) => readClaim(args),
    },
    Mutation: {
      createBroker: (_, args) => createBroker(args),
    },
  },
});
