import { createModule, gql } from "graphql-modules"
import { createBroker, readBroker, readBrokers } from "../db_functions/Broker.js"
import { readPolicies } from "../db_functions/Policy.js"

export const BrokerModule = createModule({
	id: "broker",
	typeDefs: gql`
		type Broker implements User {
			_id: ID!
			name: String!
			email: ID!
			password: String!
			policies: [Policy!]!
		}

		type Query {
			readBrokers: [Broker!]!
			readBroker(_id: ID!): Broker
		}

		type Mutation {
			createBroker(name: String!, email: ID!, password: String!): HTTPResponse
		}
	`,
	resolvers: {
		Broker: {
			policies: () => readPolicies()
		},
		Query: {
			readBrokers: () => readBrokers(),
			readBroker: (_, args) => readBroker(args)
		},
		Mutation: {
			createBroker: (_, args) => createBroker(args),
		},
	},
})