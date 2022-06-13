import { createModule, gql } from "graphql-modules";
import { createClaim, deleteClaim, updateClaim } from "../db_functions/Claim.js";

export const ClaimModule = createModule({
  id: "claim",
  typeDefs: gql`
    enum Status {
      SUBMITTED
      ACCEPTED
      REJECTED
    }
    type Claim {
      _id: ID!
      policy: Policy!
      clientId: ID!
      claimType: String!
      receiptAmount: Float!
      claimAmount: Float!
      # attachments: [File!]!
      status: Status
    }

    type Mutation {
      createClaim(
        _id: ID!
        policy: Policy!
        clientId: ID!
        claimType: String!
        receiptAmount: Float!
        claimAmount: Float!
        status: Status
      ): HTTPResponse
      updateClaim(
        _id: ID!
        policy: Policy!
        claimType: String!
        receiptAmount: Float!
        claimAmount: Float!
        status: Status
      ): HTTPResponse
      deleteClaim(_id: ID!): HTTPResponse
    }
  `,
  resolvers: {
    Mutation: {
      createClaim: (_, args, context) =>
        createClaim({ ...args, clientId: context._id }),
      updateClaim: async (_, args) => updateClaim({ _id: args._id }, args),
      deleteClaim: (_, args) => deleteClaim(args),
    },
  },
});
