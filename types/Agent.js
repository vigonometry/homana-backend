import { createModule, gql } from "graphql-modules";
import { createAgent } from "../db_functions/Agent.js"
import { readClients, readClient } from "../db_functions/Client.js"

export const AgentModule = createModule({
  id: "agent",
  typeDefs: gql`
    type Agent implements User {
      _id: ID!
      email: ID!
      password: String!
      brokerId: ID!
      clients: [Client!]!
    }

    type Query {
      readClients: [Client!]! #resolver field
      readClient(_id: ID!): Client #resolver field
    }

    type Mutation {
      createAgent(
        _id: ID!
        email: ID!
        password: String!
        brokerId: ID!
      ): HTTPResponse
    }
  `,
  resolvers: {
    Query: {
      readClients: readClients(),
      readClient: (_, args) => readClient(args),
    },
    Mutation: {
      createAgent: (_, args) => createAgent(args),
    },
  },
});
