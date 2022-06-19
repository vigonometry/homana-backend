import { createModule, gql } from "graphql-modules"
import { readPoliciesTaken, readPolicyTaken } from "../db_functions/PolicyTaken.js"

export const PolicyTakenModule = createModule({
	id: "policytaken",
	typeDefs: gql`
		enum Status {
			APPLIED
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
		}
		type Query {
			readPoliciesTaken: [PolicyTaken!]!
			readPolicyTaken(policyId: ID!): PolicyTaken
		}
	`,
	resolvers: {
		Query: {
			readPoliciesTaken: (_, args) => readPoliciesTaken(),
			readPolicyTaken: (_, args) => readPolicyTaken(args)
		}
	}
})
