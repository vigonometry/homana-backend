import mongoose from "mongoose"
import jwt from "jsonwebtoken"
import { unpackMultipleDocuments, unpackSingleDocument } from "../utils/unpackDocument.js"
const schemaTypes = mongoose.Schema.Types

export const AgentSchema = mongoose.Schema({
	name: {
		type: schemaTypes.String
	},
	email: {
		type: schemaTypes.String,
		required: [true, "This field cannot be empty."],
		unique: [true, "An account with this email already exists."]
	},
	password: {
		type: schemaTypes.String,
		required: [true, "This field cannot be empty."],
	}
})

export const AgentObject = mongoose.model("Agent", AgentSchema)

export const createAgent = (agent) => {
	const httpResponse = new AgentObject(agent)
		.save()
		.then((res) => jwt.sign({_id: res._id, email: res.email}, "homanus"))
		.then((res) => ({ response: res }))
		.catch((err) => ({ error: err }))
	return httpResponse
}

export const readAgents = (params) => {
	return AgentObject.find(params)
		.then(unpackMultipleDocuments)
		.catch((err) => console.log("Error while getting agents"))
}

export const readAgent = (params) => {
	return AgentObject.findOne(params)
		.then(unpackSingleDocument)
		.catch((err) => console.log("Error while getting agent"))
}