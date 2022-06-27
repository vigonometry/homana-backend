import { createModule, gql } from "graphql-modules"
import { createClient, readClient, readClients } from "../db_functions/Client.js"
import { readPoliciesTaken } from "../db_functions/PolicyTaken.js"

export const ClientModule = createModule({
	id: "client",
	typeDefs: gql`
		type Client implements User {
			_id: ID!
			name: String!
			email: ID!
			password: String!
			dependants: [ID!]!
			policiesTaken: [PolicyTaken!]!
		}

		type Query {
			readClients: [Client!]!,
			readClient(_id: ID!): Client
		}

		type Mutation {
			createClient(name: String!, email: ID!, password: String!, dependants: [String!]): HTTPResponse
		}
	`,
	resolvers: {
		Client: {
			policiesTaken: (parent) => readPoliciesTaken({ clientId: parent._id})
		},
		Query: {
			readClients: () => readClients(),
			readClient: (_, args) => readClient(args)
		},
		Mutation: {
			createClient: (_, args) => createClient(args),
		},
	},
})
