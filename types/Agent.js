import { createModule, gql } from "graphql-modules"
import { createAgent, readAgent, readAgents } from "../db_functions/Agent.js"
import { readPoliciesTaken } from "../db_functions/PolicyTaken.js"
import { readClaims } from "../db_functions/Claim.js"

export const AgentModule = createModule({
	id: "agent",
	typeDefs: gql`
		type Agent implements User {
			_id: ID!
			name: String!
			email: ID!
			password: String!
			isAgent: Boolean!
			policiesTaken: [PolicyTaken!]!
			claims: [Claim!]!
		}

		type Query {
			readAgents: [Agent!]!
			readAgent(_id: ID!): Agent
		}

		type Mutation {
			createAgent(name: String!, email: ID!, password: String!): HTTPResponse
		}
	`,
	resolvers: {
		Agent: {
			policiesTaken: (parent) => readPoliciesTaken({ agentId: parent._id}),
			claims: async (parent) => {
				const policiesTaken = await readPoliciesTaken({ agentId: parent._id })
				const ids = policiesTaken.map(p => p._id.toString())
				const claims = await readClaims({ policyId: { $in: ids }})
				console.log(claims)
				return claims
			}
		},
		Query: {
			readAgents: () => readAgents(),
			readAgent: (_, args) => readAgent(args)
		},
		Mutation: {
			createAgent: (_, args) => createAgent(args),
		},
	},
})
