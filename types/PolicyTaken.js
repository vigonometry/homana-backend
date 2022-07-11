import { createModule, gql } from "graphql-modules"
import { createPolicyTaken, readPoliciesTaken, readPolicyTaken, updatePolicyTaken, updateClientId } from "../db_functions/PolicyTaken.js"
import { readPolicy } from "../db_functions/Policy.js"
import { readClient } from "../db_functions/Client.js"
import { readAgent } from "../db_functions/Agent.js"
import { readBroker } from "../db_functions/Broker.js"

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
			dependants: [String!]!
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
			updatePTDependants(_id: ID!, dependants: [String!]!): HTTPResponse
			updateClientId(_id: ID!, clientId: ID!): HTTPResponse
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
			updatePTDependants: async (_, args, context) => {
				const client = await readClient({ _id: context._id })
				if (!client) return { error: 'Error reading client'}
				const dependants = client.dependants
				const difference = args.dependants.filter(d => !dependants.includes(d))
				if (difference.length > 0) return { error: 'One or more dependants are not associated with client'}
				const httpResponse = await updatePolicyTaken({ _id: args._id }, args)
				return httpResponse
			},
			updatePolicyTaken: (_, args) => updatePolicyTaken({_id: args._id}, args),
			policyTakenNext: async (_, args, context) => {
				const { _id, status } = args
				var user = await readClient({ _id: context._id })
				if (!user) user = await readBroker({ _id: context._id })
				if (!user) return { error: 'Not authorised'}
				const nextStatus = status === 'QUOTED' ? 'APPLIED' : 'APPROVED'
				const httpResponse = await updatePolicyTaken({ _id: _id}, { status: nextStatus })
				if (httpResponse.response) return { response: nextStatus}
				return { error: httpResponse.error }
			},
			policyTakenCancel: async (_, args, context) => {
				const { _id, status } = args
				var user = await readAgent({ _id: context._id })
				if (!user) user = await readBroker({ _id: context._id })
				if (!user) return { error: 'Not authorised'}
				const nextStatus = status === 'QUOTED' ? 'CANCELLED' : 'REJECTED'
				const httpResponse = await updatePolicyTaken({ _id: _id}, { status: nextStatus })
				if (httpResponse.response) return { response: nextStatus}
				return { error: httpResponse.error }
			},
			updateClientId: (_, args) => updateClientId(args)
		}
	}
})
