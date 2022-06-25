import mongoose from "mongoose"
import jwt from "jsonwebtoken"
import { unpackMultipleDocuments , unpackSingleDocument } from "../utils/unpackDocument.js"
const schemaTypes = mongoose.Schema.Types

export const BrokerSchema = mongoose.Schema({
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

export const BrokerObject = mongoose.model("Broker", BrokerSchema)

export const createBroker = (broker) => {
	const httpResponse = new BrokerObject(broker)
		.save()
		.then((res) => jwt.sign({_id: res._id, email: res.email}, "homanus"))
		.then((res) => ({ response: res }))
		.catch((err) => ({ error: err }))
	return httpResponse
}

export const readBrokers = (params) => {
	return BrokerObject.find(params)
		.then(unpackMultipleDocuments)
		.catch((err) => console.log("Error while getting brokers"))
}

export const readBroker = (params) => {
	return BrokerObject.findOne(params)
		.then(unpackSingleDocument)
		.catch((err) => console.log("Error while getting broker"))
}