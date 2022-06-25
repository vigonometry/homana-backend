import { createModule, gql } from "graphql-modules"
import { readPoliciesTaken, readPolicyTaken } from "../db_functions/PolicyTaken.js"

export const PolicyTakenModule = createModule({
	id: "policytaken",
	typeDefs: gql`
		enum Status {
			QUOTED
			APPLIED
			CANCELLED
			APPROVED
			REJECTED
		}
		type PolicyTaken {
			_id: ID!
			policyId: ID!
			customerId: ID!
			agentId: ID!
			date: String!
			status: Status
			insuredAmount: Float
			premium: Float
		}
		type Query {
			readPoliciesTaken: [PolicyTaken!]!
			readPolicyTaken(_id: ID!): PolicyTaken
		}
	`,
	resolvers: {
		Query: {
			readPoliciesTaken: () => readPoliciesTaken(),
			readPolicyTaken: (_, args) => readPolicyTaken(args)
		}
	}
})
