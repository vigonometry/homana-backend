import mongoose from "mongoose"
import { unpackMultipleDocuments, unpackSingleDocument } from "../utils/unpackDocument.js"

const schemaTypes = mongoose.Schema.Types

export const ClientSchema = mongoose.Schema({
	email: {
		type: schemaTypes.String,
		required: [true, "This field cannot be empty."],
		unique: [true, "An account with this email already exists."]
	},
	password: {
		type: schemaTypes.String,
		required: [true, "This field cannot be empty."],
	},
	dependants: {
		type: [schemaTypes.String],
		required: [true, "This field cannot be empty."],
	}
})

export const ClientObject = mongoose.model("Client", ClientSchema)

export const createClient = (client) => {
	const httpResponse = new ClientObject({ ...client })
		.save()
		.then((res) => ({ response: res._id }))
		.catch((err) => ({ error: err }))
	return httpResponse
}

export const readClients = (params) => {
	return ClientObject.find(params)
		.then(unpackMultipleDocuments)
		.catch((err) => console.log("Error while getting clients"))
}

export const readClient = (params) => {
	return ClientObject.findOne(params)
		.then(unpackSingleDocument)
		.catch((err) => console.log("Error while getting client"))
}
