import { createModule, gql } from "graphql-modules"
import jwt from "jsonwebtoken"
import { readAgent } from "../db_functions/Agent.js"
import { readBroker } from "../db_functions/Broker.js"
import { readClient } from "../db_functions/Client.js"

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
				console.log(email)
				var user = await readBroker({ email: email })
				if (!user) user = await readAgent({ email: email })
				if (!user) user = await readClient({ email: email })
				if (!user) return { error: "Email is not in our database." }
				const valid = password === user.password
				if (!valid) return { error: "Incorrect password entered." }
				return { response: jwt.sign({ _id: user._id, email: email }, "homanus") }
			},
		},
	},
})