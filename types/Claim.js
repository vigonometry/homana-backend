import { createModule, gql } from "graphql-modules"
import { createClaim, deleteClaim, readClaim, readClaims, updateClaim } from "../db_functions/Claim.js"

export const ClaimModule = createModule({
	id: "claim",
	typeDefs: gql`
		enum Status {
			SUBMITTED
			ACCEPTED
			REJECTED
		}

		type Claim {
			_id: ID!
			policyId: ID!
			clientId: ID!
			claimType: String!
			receiptDate: String!
			claimDate: String!
			receiptAmount: Float!
			claimAmount: Float!
			attachments: [String!]!
			status: Status
		}

		type Query {
			readClaims: [Claim!]!
			readClaim(_id: ID!): Claim
		}

		type Mutation {
			createClaim(policyId: ID!, claimType: String!, receiptDate: String!, claimDate: String!, receiptAmount: Float!, claimAmount: Float!, attachments: [String!]! status: String): HTTPResponse
			updateClaim(_id: String!, clientId: ID! policyId: ID!, claimType: String!, receiptDate: String!, claimDate: String!, receiptAmount: Float!, claimAmount: Float!, attachments: [String!]! status: String): HTTPResponse
			deleteClaim(_id: ID!): HTTPResponse
		}
	`,
	resolvers: {
		Query: {
			readClaims: () => readClaims(),
			readClaim: (_, args) => readClaim(args)
		},
		Mutation: {
			createClaim: (_, args, context) => createClaim({ ...args, clientId: context._id }),
			updateClaim: (_, args) => updateClaim({ _id: args._id }, args),
			deleteClaim: (_, args) => deleteClaim(args),
		},
	},
})
