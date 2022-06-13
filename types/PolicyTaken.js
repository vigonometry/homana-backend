import { createModule, gql } from "graphql-modules";

export const PolicyTakenModule = createModule({
  id: "policytaken",
  typeDefs: gql`
    enum Status {
      APPLIED
      APPROVED
      REJECTED
    }
    type Policy {
      _id: ID!
      policyId: ID!
      customerId: ID!
      agentId: ID!
      date: String!
      status: Status
    }
  `,
});
