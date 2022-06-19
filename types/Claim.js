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
			policy: Policy!
			clientId: ID!
			claimType: String!
			receiptAmount: Float!
			claimAmount: Float!
			# attachments: [File!]!
			status: Status
		}

		type Query {
			readClaims: [Claim!]!
			readClaim(_id: ID!): Claim
		}

		type Mutation {
			createClaim(
				policy: String!
				clientId: String!
				claimType: String!
				receiptAmount: Float!
				claimAmount: Float!
				status: String
			): HTTPResponse
			updateClaim(
				_id: String!
				policy: String!
				clientId: String!
				claimType: String!
				receiptAmount: Float!
				claimAmount: Float!
				status: String
			): HTTPResponse
			deleteClaim(_id: ID!): HTTPResponse
		}
	`,
	resolvers: {
		Query: {
			readClaims: () => readClaims(),
			readClaim: (_, args) => readClaim(args)
		},
		Mutation: {
			createClaim: (_, args, context) =>
				createClaim({ ...args, clientId: context._id }),
			updateClaim: async (_, args) => updateClaim({ _id: args._id }, args),
			deleteClaim: (_, args) => deleteClaim(args),
		},
	},
})
