import mongoose from "mongoose"
import { unpackMultipleDocuments, unpackSingleDocument } from "../utils/unpackDocument.js"
const schemaTypes = mongoose.Schema.Types

export const PolicySchema = mongoose.Schema({
	title: {
		type: schemaTypes.String,
		required: [true, "This field cannot be empty."],
	},
	brokerId: {
		type: schemaTypes.String,
		required: [true, "This field cannot be empty."],
	},
	type: {
		type: schemaTypes.String,
		required: [true, "This field cannot be empty."],
	},
	insuredAmount: {
		type: schemaTypes.Number,
		required: [true, "This field cannot be empty."],
	},
})

export const PolicyObject = mongoose.model("Policy", PolicySchema)

export const readPolicies = (params) => {
	return PolicyObject.find(params)
		.then(unpackMultipleDocuments)
		.catch((err) => console.log("Error while getting lessons"))
}

export const readPolicy = (params) => {
	return PolicyObject.findOne(params)
		.then(unpackSingleDocument)
		.catch((err) => console.log("Error while getting lesson"))
}

export const createPolicy = (policy) => {
	const httpResponse = new PolicyObject({ ...policy })
		.save()
		.then((res) => ({ completed: res._id }))
		.catch((err) => ({ error: err }))
	return httpResponse
}

export const updatePolicy = (query, update) => {
	return PolicyObject.findOneAndUpdate(query, update, {
		upsert: true,
		new: true,
	})
		.then((res) => {
			response: res._id
		})
		.catch((err) => {
			error: err
		})
}

export const deletePolicy = (params) => {
	return PolicyObject.findOneAndDelete(params)
		.then((res) => ({ response: "Deleted" }))
		.catch((err) => {
			error: err
		})
}