import { createApplication } from "graphql-modules"
import { AgentModule } from "../types/Agent.js"
import { BrokerModule } from "../types/Broker.js"
import { ClaimModule } from "../types/Claim.js"
import { ClientModule } from "../types/Client.js"
import { HTTPResponseModule } from "../types/HTTPResponse.js"
import { PolicyModule } from "../types/Policy.js"
import { PolicyTakenModule } from "../types/PolicyTaken.js"
import { UserModule } from "../types/User.js"

export const apolloApplication = createApplication({
	modules: [
		AgentModule,
		BrokerModule,
		ClaimModule,
		ClientModule,
		PolicyModule,
		PolicyTakenModule,
		UserModule,
		HTTPResponseModule,
	],
})