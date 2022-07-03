import { createModule, gql } from "graphql-modules"
import { createPolicyTaken, readPoliciesTaken, readPolicyTaken, updatePolicyTaken } from "../db_functions/PolicyTaken.js"
import { readPolicy } from "../db_functions/Policy.js"
import { readClient } from "../db_functions/Client.js"
import { readAgent } from "../db_functions/Agent.js"


export const PolicyTakenModule = createModule({
	id: "policytaken",
	typeDefs: gql`
		enum Status {
			QUOTED
			APPLIED
			CANCELLED
			APPROVED
			REJECTED
			SUBMITTED
			PROCESSING
		}
		type PolicyTaken {
			_id: ID!
			policyId: ID!
			clientId: ID!
			agentId: ID!
			date: String!
			status: Status!
			insuredAmount: Float
			premium: Float
			policy: Policy
			client: Client
			agent: Agent
		}
		type Query {
			readPoliciesTaken: [PolicyTaken!]!
			readPolicyTaken(_id: ID!): PolicyTaken
		}
		type Mutation {
			createPolicyTaken(policyId: ID!, clientEmail: ID!, agentId: ID!, status: Status, insuredAmount: Float!, premium: Float!): HTTPResponse
			updatePolicyTaken(_id: ID!, policyId: ID, clientId: ID, agentId: ID, status: Status, insuredAmount: Float, premium: Float): HTTPResponse
			policyTakenNext(_id: ID!, status: Status!): HTTPResponse
			policyTakenCancel(_id: ID!, status: Status!): HTTPResponse
		}
	`,
	resolvers: {
		PolicyTaken: {
			policy: (parent) => readPolicy({ _id: parent.policyId }),
			client: (parent) => readClient({ _id: parent.clientId }),
			agent: (parent) => readAgent({ _id: parent.agentId })
		},
		Query: {
			readPoliciesTaken: () => readPoliciesTaken(),
			readPolicyTaken: (_, args) => readPolicyTaken(args)
		},
		Mutation: {
			createPolicyTaken: async (_, args) => {
				const client = await readClient({ email: args.clientEmail })
				if (!client) return { error: 'Client not found' }
				const clientPoliciesTaken = await readPoliciesTaken({ clientId: client._id})
				if (clientPoliciesTaken.filter(p => p.status === 'APPROVED').map(p => p.policyId.toString()).includes(args.policyId)) return { error: 'Client already registered in this policy.'}
				const httpResponse = await createPolicyTaken({...args, clientId: client._id})
				return httpResponse
			},
			updatePolicyTaken: (_, args) => updatePolicyTaken({_id: args._id}, args),
			policyTakenNext: async (_, args) => {
				const { _id, status } = args
				const nextStatus = status === 'QUOTED' ? 'APPLIED' : 'APPROVED'
				const httpResponse = await updatePolicyTaken({ _id: _id}, { status: nextStatus })
				if (httpResponse.response) return { response: nextStatus}
				return { error: httpResponse.error }
			},
			policyTakenCancel: async (_, args) => {
				const { _id, status } = args
				const nextStatus = status === 'QUOTED' ? 'CANCELLED' : 'REJECTED'
				const httpResponse = await updatePolicyTaken({ _id: _id}, { status: nextStatus })
				if (httpResponse.response) return { response: nextStatus}
				return { error: httpResponse.error }
			}
		}
	}
})
