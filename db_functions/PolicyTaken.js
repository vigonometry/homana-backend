import mongoose from "mongoose";
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
