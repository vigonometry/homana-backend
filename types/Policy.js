import { createModule, gql } from "graphql-modules"
import { readBroker } from "../db_functions/Broker.js"
import { createPolicy, deletePolicy, readPolicies, readPolicy, updatePolicy } from "../db_functions/Policy.js"

export const PolicyModule = createModule({
	id: "policy",
	typeDefs: gql`
		type Policy {
			_id: ID!
			title: String!
			type: String!
			insuredAmount: Float!
			premium: Float!
		}
		type Query {
			readPolicies: [Policy!]!
			readPolicy: Policy
		}
		type Mutation {
			createPolicy(title: String!, type: String!, insuredAmount: Float!, premium: Float!): HTTPResponse
			updatePolicy(_id: ID!, title: String!, type: String!, insuredAmount: Float!, premium: Float!): HTTPResponse
			deletePolicy(_id: ID!): HTTPResponse
		}
	`,
	resolvers: {
		Query: {
			readPolicies: () => readPolicies(),
			readPolicy: (_, args) => readPolicy(args)
		},
		Mutation: {
			createPolicy: async (_, args, context) => {
				const user = await readBroker({ _id: context._id })
				if (!user) return { error: 'Not authorised'}
				return await createPolicy(args)
			} ,
			updatePolicy: async (_, args) => { 
				const user = await readBroker({ _id: context._id })
				if (!user) return { error: 'Not authorised'}
				return await updatePolicy({_id: args._id}, args) 
			},
			deletePolicy: async (_, args) => { 
				const user = await readBroker({ _id: context._id })
				if (!user) return { error: 'Not authorised'}
				return await deletePolicy(args) 
			},
		},
	},
})