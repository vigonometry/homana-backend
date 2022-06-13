import { ApolloServer, AuthenticationError } from 'apollo-server-express';
import http from 'http';
import express from 'express';
import jwt from 'jsonwebtoken';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import { apolloApplication } from './apolloApplication.js';


const schema = apolloApplication.createSchemaForApollo();

const getUser = (token) => {
    if (token) {
        try {
            return jwt.verify(token, "homanus")
        } catch (err) {
            return { error: true, msg: "Session invalid"}
        }
    }
}

const apolloContext = async ({ req }) => {
        if (req.body.operationName === 'IntrospectionQuery') return {}
        console.log(req.body.operationName)
        const token = req.headers.authorization || ''
        if (!token.includes('Bearer ')) throw new AuthenticationError("Token must use Bearer format.")
        const user = getUser(token.split(' ')[1])
        if (!user) throw new AuthenticationError()
        return user
}

export default async function startApolloServer() {
    const app = express()
    const httpServer = http.createServer(app)
    const apolloServer = new ApolloServer({
        schema,
        csrfPrevention: true,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
        context: apolloContext
    })
    await apolloServer.start()
    apolloServer.applyMiddleware({
        app,
        path: '/'
    })
    await new Promise((resolve) => httpServer.listen( { port: 4000 }, resolve))
	console.log(`🚀 Server ready at http://localhost:4000${apolloServer.graphqlPath}`);
}