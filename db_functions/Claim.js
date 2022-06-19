import mongoose from "mongoose"
import { unpackMultipleDocuments, unpackSingleDocument } from "../utils/unpackDocument.js"
import { PolicySchema } from "./Policy.js"

const schemaTypes = mongoose.Schema.Types

export const ClaimSchema = mongoose.Schema({
	policy: {
		type: PolicySchema,
		required: [true, "This field cannot be empty."],
	},
	clientId: {
		type: schemaTypes.String,
		required: [true, "This field cannot be empty."],
	},
	claimType: {
		type: schemaTypes.String,
		required: [true, "This field cannot be empty."],
	},
	receiptAmount: {
		type: schemaTypes.Number,
		required: [true, "This field cannot be empty."],
	},
	claimAmount: {
		type: schemaTypes.Number,
		required: [true, "This field cannot be empty."],
	},
})

export const ClaimObject = mongoose.model("Claim", ClaimSchema)

export const createClaim = (claim) => {
	const httpResponse = new ClaimObject({ ...claim })
		.save()
		.then((res) => ({ completed: res._id }))
		.catch((err) => ({ error: err }))
	return httpResponse
}

export const readClaims = (params) => {
	return ClaimObject.find(params)
		.then(unpackMultipleDocuments)
		.catch((err) => console.log("Error while getting lessons"))
}

export const readClaim = (params) => {
	return ClaimObject.findOne(params)
		.then(unpackSingleDocument)
		.catch((err) => console.log("Error while getting lesson"))
}

export const updateClaim = (query, update) => {
	return ClaimObject.findOneAndUpdate(query, update, { upsert: true, new: true, })
		.then((res) => ({response: res._id}))
		.catch((err) => ({ error: err }))
}

export const deleteClaim = (params) => {
	return ClaimObject.findOneAndDelete(params)
		.then((res) => ({ response: "Deleted" }))
		.catch((err) => ({ error: err }))
}