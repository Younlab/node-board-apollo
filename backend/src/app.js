import { ApolloServer } from 'apollo-server-express';
import schema from './graphql';
import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import models from './database/models';
import { getUser, roleCheck } from './utils/isAuthenticated';
dotenv.config();

const PORT = process.env.PORT || 4000;

const app = express();

const server = new ApolloServer({
  schema,
  context: async ({ req }) => {
    const tokenWithBearer = req.headers.authorization || ' ';

    // token parse
    const token = tokenWithBearer.split(' ')[1] || null;

    const user = getUser(token);
    return { models, user, roleCheck };
  },
});

server.applyMiddleware({ app });

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

app.listen(PORT, () =>
  console.log(`🚀 Server Runnings http://localhost:${PORT}`)
);
