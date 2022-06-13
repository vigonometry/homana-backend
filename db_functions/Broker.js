import mongoose from "mongoose";
import { unpackSingleDocument } from "../utils/unpackDocument.js";
import { AgentSchema } from "./Agent.js";
import { ClientSchema } from "./Client.js";
import { PolicySchema } from "./Policy.js";
const schemaTypes = mongoose.Schema.Types;

export const BrokerSchema = mongoose.Schema({
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
  agents: {
    type: [AgentSchema],
    required: [true, "This field cannot be empty."],
  },
  clients: {
    type: [ClientSchema],
    required: [true, "This field cannot be empty."],
  },
  policies: {
    type: [PolicySchema],
    required: [true, "This field cannot be empty."],
  },
});

export const BrokerObject = mongoose.model("Broker", BrokerSchema);

export const createBroker = (broker) => {
  const httpResponse = new BrokerObject({ ...broker })
    .save()
    .then((res) => ({ completed: res._id }))
    .catch((err) => ({ error: err }));
  return httpResponse;
};

export const readBroker = (params) => {
  return BrokerObject.findOne(params)
    .then(unpackSingleDocument)
    .catch((err) => console.log("Error while getting lessons"));
};


