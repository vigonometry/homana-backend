import { createModule, gql } from "graphql-modules"
import { createClaim, deleteClaim, readClaim, readClaims, updateClaim } from "../db_functions/Claim.js"
import { readClient } from "../db_functions/Client.js"

export const ClaimModule = createModule({
	id: "claim",
	typeDefs: gql`
		type Claim {
			_id: ID!
			policyId: ID!
			clientId: ID!
			client: Client
			# claimType: String!
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
			createClaim(policyId: ID!, receiptDate: String!, receiptAmount: Float!, claimAmount: Float!, attachments: [String!]!, status: String): HTTPResponse
			deleteClaim(_id: ID!): HTTPResponse
			claimNext(_id: ID!, status: Status!): HTTPResponse
			claimCancel(_id: ID!, status: Status!): HTTPResponse
		}
	`,
	resolvers: {
		Claim: {
			client: (parent) => readClient({ _id: parent.clientId })
		},
		Query: {
			readClaims: () => readClaims(),
			readClaim: (_, args) => readClaim(args)
		},
		Mutation: {
			createClaim: (_, args, context) => createClaim({ ...args, clientId: context._id, claimDate: new Date().toISOString(), status: 'SUBMITTED' }),
			deleteClaim: (_, args) => deleteClaim(args),
			claimNext: async (_, args) => {
				const { _id, status } = args
				const nextStatus = status === 'PROCESSING' ? 'APPROVED' : 'PROCESSING'
				const httpResponse = await updateClaim({ _id: _id}, {status: nextStatus})
				if (httpResponse.response) return { response: nextStatus}
				return { error: httpResponse.error }
			},
			claimCancel: async (_, args) => {
				const { _id, status } = args
				const nextStatus = status === 'SUBMITTED' ? 'CANCELLED' : 'REJECTED'
				const httpResponse = await updateClaim({ _id: _id}, {status: nextStatus})
				if (httpResponse.response) return { response: nextStatus}
				return { error: httpResponse.error }
			}
		},
	},
})
