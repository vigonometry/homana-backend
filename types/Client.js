import { createModule, gql } from "graphql-modules"
import { readClaims } from "../db_functions/Claim.js"
import { createClient, readClient, readClients, updateClient } from "../db_functions/Client.js"
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
			claims: [Claim!]!
		}

		type Query {
			readClients: [Client!]!,
			readClient(_id: ID!): Client
		}

		type Mutation {
			createClient(name: String!, email: ID!, password: String!, dependants: [String!]): HTTPResponse
			updateDependants(dependants: [String!]!): HTTPResponse
		}
	`,
	resolvers: {
		Client: {
			claims: (parent) => readClaims({ clientId: parent._id }),
			policiesTaken: (parent) => readPoliciesTaken({ clientId: parent._id})
		},
		Query: {
			readClients: () => readClients(),
			readClient: (_, args) => readClient(args)
		},
		Mutation: {
			createClient: (_, args) => createClient(args),
			updateDependants: (_, args, context) => updateClient({ _id: context._id}, args)
		},
	},
})
