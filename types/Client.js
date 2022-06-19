import { createModule, gql } from "graphql-modules"
import { createClient, readClient, readClients } from "../db_functions/Client.js"

export const ClientModule = createModule({
	id: "client",
	typeDefs: gql`
		type Client implements User {
			_id: ID!
			email: ID
			password: String
			dependants: [ID!]!
		}

		type Query {
			readClients: [Client!]!,
			readClient(_id: ID!): Client
		}

		type Mutation {
			createClient(email: String!, password: String!, dependants: [String!]!): HTTPResponse
		}
	`,
	resolvers: {
		Query: {
			readClients: () => readClients(),
			readClient: (_, args) => readClient(args)
		},
		Mutation: {
			createClient: (_, args) => createClient(args),
		},
	},
})
