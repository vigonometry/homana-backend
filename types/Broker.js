import { createModule, gql } from "graphql-modules";
import { createBroker, readBroker, readBrokers } from "../db_functions/Broker.js";

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
      readBrokers: [Broker!]!
      readBroker(_id: ID!): Broker
    }

    type Mutation {
      createBroker(email: String!, password: String!): HTTPResponse
    }
  `,
  resolvers: {
    Query: {
      readBrokers: (_, args) => readBrokers(),
      readBroker: (_, args) => readBroker(args)
    },
    Mutation: {
      createBroker: (_, args) => createBroker(args),
    },
  },
});
