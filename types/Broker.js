import { createModule, gql } from "graphql-modules"
import { createBroker, readBroker, readBrokers } from "../db_functions/Broker.js"
import { readPolicies } from "../db_functions/Policy.js"
import { readPoliciesTaken } from "../db_functions/PolicyTaken.js"

export const BrokerModule = createModule({
	id: "broker",
	typeDefs: gql`
		type Broker implements User {
			_id: ID!
			name: String!
			email: ID!
			password: String!
			policies: [Policy!]!
			policiesTaken: [PolicyTaken!]!
			claims: [Claim!]!
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
			policies: () => readPolicies(),
			policiesTaken: () => readPoliciesTaken({ $or: [{status: 'APPLIED'}, {status: 'APPROVED'}, {status: 'REJECTED'}] })
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