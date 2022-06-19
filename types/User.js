import { createModule, gql } from "graphql-modules"
import jwt from "jsonwebtoken"
import { createAgent, readAgent } from "../db_functions/Agent.js"
import { createBroker, readBroker } from "../db_functions/Broker.js"
import { createClient, readClient } from "../db_functions/Client.js"

export const UserModule = createModule({
	id: "user",
	typeDefs: gql`
		interface User {
			_id: ID!
			email: ID
			password: String
		}

		type Query {
			currentUser: User
		}

		type Mutation {
			login(email: String!, password: String!): HTTPResponse
			register(name: String!, email: String!, password: String!, type: String!): HTTPResponse
		}
	`,
	resolvers: {
		User: {
			__resolveType: (obj) => obj.dependants ? 'Client' : obj.brokerId ? 'Agent' : 'Broker'
		},
		Query: {
			currentUser: async (_, __, context) => {
				var user = await readBroker({ _id: context._id })
				if (!user) user = await readAgent({ _id: context._id })
				if (!user) user = await readClient({ _id: context._id })
				return user
			},
		},
		Mutation: {
			login: async (_, args) => {
				const { email, password } = args
				var user = await readBroker({ email: email })
				if (!user) user = await readAgent({ email: email })
				if (!user) user = await readClient({ email: email })
				if (!user) return { error: "Email is not in our database." }
				const valid = password === user.password
				if (!valid) return { error: "Incorrect password entered." }
				return { response: jwt.sign({ _id: user._id, email: email }, "homanus") }
			},
			register: async (_, args) => {
				var httpResponse = { error: 'No suitable type'}
				if (args.type === 'Client') httpResponse = await createClient(args)
				else if (args.type === 'Broker') httpResponse = await createBroker(args)
				else if (args.type === 'Agent') httpResponse = await createAgent(args)
				return httpResponse
			}
		},
	},
})