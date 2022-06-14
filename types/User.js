import { createModule, gql } from "graphql-modules";
import jwt from "jsonwebtoken";
import { readAgent } from "../db_functions/Agent.js";
import { readBroker } from "../db_functions/Broker.js";
import { readClient } from "../db_functions/Client.js";

export const UserModule = createModule({
  id: "user",
  typeDefs: gql`
    interface User {
      _id: ID!
      email: ID
      password: String
    }

    type HomanaContext {
      currentUser: UserModule
      dbInitialized: Boolean
    }

    type Query {
      homanaContext: HomanaContext
    }

    type Mutation {
      login(email: String, password: String): HTTPResponse
    }
  `,
  resolvers: {
    Query: {
      homanaContext: async (_, __, context) => {
        var user = await readClient({ _id: context._id });
        if (!user) {
          user = await readAgent({ _id: context._id });
        }
        if (!user) {
          user = await readBroker({ _id: context._id });
        }

        return { currentUser: user, dbInitialized: true };
      },
    },
    Mutation: {
      login: async (_, args) => {
        const { email, password } = args;
        const client = await readClient({ email: email });
        const agent = await readAgent({ email: email });
        const broker = await readBroker({ email: email });

        const user = !client ? (!agent ? broker : agent) : client;
        if (!user) return { error: "Email is not in our database." };
        const valid = password === user.password;
        if (!valid) return { error: "Incorrect password entered." };
        return { response: jwt.sign({ _id: user._id }, "homanus") };
      },
    },
  },
});
