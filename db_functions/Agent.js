import mongoose from "mongoose";
import {
  unpackMultipleDocuments,
  unpackSingleDocument,
} from "../utils/unpackDocument.js";
import { ClientSchema } from "./Client.js";
const schemaTypes = mongoose.Schema.Types;

export const AgentSchema = mongoose.Schema({
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
  brokerId: {
    type: schemaTypes.String,
    required: [true, "This field cannot be empty."],
  },
  clients: {
    type: [ClientSchema],
    required: [true, "This field cannot be empty."],
  },
});

export const AgentObject = mongoose.model("Agent", AgentSchema);

export const readAgents = (params) => {
  return AgentObject.find(params)
    .then(unpackMultipleDocuments)
    .catch((err) => console.log("Error while getting lessons"));
};

export const readAgent = (params) => {
  return AgentObject.findOne(params)
    .then(unpackSingleDocument)
    .catch((err) => console.log("Error while getting lesson"));
};

export const createAgent = (agent) => {
  const httpResponse = new AgentObject({ ...agent })
    .save()
    .then((res) => ({ completed: res._id }))
    .catch((err) => ({ error: err }));
  return httpResponse;
};
