import mongoose from "mongoose";
import { unpackMultipleDocuments, unpackSingleDocument } from "../utils/unpackDocument.js";
const schemaTypes = mongoose.Schema.Types;

export const PolicyTakenSchema = mongoose.Schema({
  _id: {
    type: schemaTypes.ObjectId,
    required: [true, "This field cannot be empty."],
  },
  policyId: {
    type: schemaTypes.ObjectId,
    required: [true, "This field cannot be empty."],
  },
  customerId: {
    type: schemaTypes.ObjectId,
    required: [true, "This field cannot be empty."],
  },
  agentId: {
    type: schemaTypes.ObjectId,
    required: [true, "This field cannot be empty."],
  },
  date: {
    type: schemaTypes.String,
    required: [true, "This field cannot be empty."],
  },
  status: {
    type: schemaTypes.String,
    required: false,
  },
});

export const PolicyTakenObject = mongoose.model("PolicyTaken", PolicyTakenSchema);

export const readPoliciesTaken = (params) => {
  return PolicyTakenObject.find(params)
    .then(unpackMultipleDocuments)
    .catch((err) => console.log("Error while getting lessons"));
};

export const readPolicyTaken = (params) => {
  return PolicyTakenObject.findOne(params)
    .then(unpackSingleDocument)
    .catch((err) => console.log("Error while getting lesson"));
};