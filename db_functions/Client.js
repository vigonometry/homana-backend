import mongoose from "mongoose";
import {
  unpackMultipleDocuments,
  unpackSingleDocument,
} from "../utils/unpackDocument.js";

import { ClaimSchema } from "./Claim.js";
import { PolicySchema } from "./Policy.js";

const schemaTypes = mongoose.Schema.Types;

export const ClientSchema = mongoose.Schema({
  _id: {
    type: schemaTypes.ObjectId,
    required: [true, "This field cannot be empty."],
  },
  email: {
    type: schemaTypes.String,
    required: [true, "This field cannot be empty."],
  },
  password: {
    type: schemaTypes.String,
    required: [true, "This field cannot be empty."],
  },
  dependants: {
    type: [schemaTypes.String],
    required: [true, "This field cannot be empty."],
  },
  policies: {
    type: [PolicySchema],
    required: [true, "This field cannot be empty."],
  },
  claims: {
    type: [ClaimSchema],
    required: [true, "This field cannot be empty."],
  },
});

export const ClientObject = mongoose.model("Client", ClientSchema);

export const readClients = (params) => {
  return ClientObject.find(params)
    .then(unpackMultipleDocuments)
    .catch((err) => console.log("Error while getting lessons"));
};

export const readClient = (params) => {
  return ClientObject.findOne(params)
    .then(unpackSingleDocument)
    .catch((err) => console.log("Error while getting lesson"));
};

export const createClient = (client) => {
  const httpResponse = new AgentObject({ ...client })
    .save()
    .then((res) => ({ completed: res._id }))
    .catch((err) => ({ error: err }));
  return httpResponse;
};
