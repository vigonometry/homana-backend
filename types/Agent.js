import { createModule, gql } from "graphql-modules"
import { createAgent, readAgent, readAgents } from "../db_functions/Agent.js"

export const AgentModule = createModule({
	id: "agent",
	typeDefs: gql`
		type Agent implements User {
			_id: ID!
			name: String!
			email: ID!
			password: String!
			brokerId: ID!
		}

		type Query {
			readAgents: [Agent!]!
			readAgent(_id: ID!): Agent
		}

		type Mutation {
			createAgent(name: String!, email: String!, password: String!, brokerId: String!): HTTPResponse
		}
	`,
	resolvers: {
		Query: {
			readAgents: () => readAgents(),
			readAgent: (_, args) => readAgent(args)
		},
		Mutation: {
			createAgent: (_, args) => createAgent(args),
		},
	},
})
