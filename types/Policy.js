import { createModule, gql } from "graphql-modules"
import { createPolicy, deletePolicy, readPolicies, readPolicy, updatePolicy } from "../db_functions/Policy.js"

export const PolicyModule = createModule({
	id: "policy",
	typeDefs: gql`
		type Policy {
			_id: ID!
			title: String!
			brokerId: ID!
			type: String!
			insuredAmount: Float!
		}
		type Query {
			readPolicies: [Policy!]!
			readPolicy: Policy
		}
		type Mutation {
			createPolicy(title: String!, brokerId: String!, type: String!, insuredAmount: Float!): HTTPResponse
			updatePolicy(_id: ID!, insuredAmount: Float!): HTTPResponse
			deletePolicy(_id: ID!): HTTPResponse
		}
	`,
	resolvers: {
		Query: {
			readPolicies: () => readPolicies(),
			readPolicy: (_, args) => readPolicy(args)
		},
		Mutation: {
			createPolicy: (_, args, context) => createPolicy(args),
			updatePolicy: (_, args) => updatePolicy({_id: args._id}, args),
			deletePolicy: (_, args) => deletePolicy(args),
		},
	},
})