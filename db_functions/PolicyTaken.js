import mongoose from "mongoose"
import { unpackMultipleDocuments, unpackSingleDocument } from "../utils/unpackDocument.js"
const schemaTypes = mongoose.Schema.Types

export const PolicyTakenSchema = mongoose.Schema({
	policyId: {
		type: schemaTypes.ObjectId,
		required: [true, "This field cannot be empty."],
	},
	clientId: {
		type: schemaTypes.String,
		required: [true, "This field cannot be empty."],
	},
	agentId: {
		type: schemaTypes.String,
		required: [true, "This field cannot be empty."],
	},
	date: {
		type: schemaTypes.String,
		required: [true, "This field cannot be empty."],
		default: new Date().toISOString()
	},
	status: {
		type: schemaTypes.String,
		required: false,
		default: 'QUOTED'
	},
	insuredAmount: {
		type: schemaTypes.Number
	},
	premium: {
		type: schemaTypes.Number
	},
	dependants: {
		type: [schemaTypes.String],
		default: []
	}
})

export const PolicyTakenObject = mongoose.model("PolicyTaken", PolicyTakenSchema)

export const createPolicyTaken = (pt) => {
	const httpResponse = new PolicyTakenObject(pt)
		.save()
		.then((res) => ({ response: res._id}))
		.catch((err) => ({ error: err}))
	return httpResponse
}

export const readPoliciesTaken = (params) => {
	return PolicyTakenObject.find(params)
		.then(unpackMultipleDocuments)
		.catch((err) => console.log("Error while getting lessons"))
}

export const readPolicyTaken = (params) => {
	return PolicyTakenObject.findOne(params)
		.then(unpackSingleDocument)
		.catch((err) => console.log("Error while getting lesson"))
}

export const updatePolicyTaken = (query, update) => {
	return PolicyTakenObject.findOneAndUpdate(query, {...update, date: new Date().toISOString()}, { upsert: true, new: true }) 
		.then((res) => ({ response: res._id}))
		.catch((err) => ({ error: err }))
}