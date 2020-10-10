import { ApolloServer } from 'apollo-server-express';
import connectSqlite3 from 'connect-sqlite3';
import express from 'express';
import session from 'express-session';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { createConnection, getConnectionOptions } from 'typeorm';
import { ActorResolver, AuthResolver, DirectorResolver, MovieResolver } from './resolvers';

// I like to use redis for this: https://github.com/tj/connect-redis
const SQLiteStore = connectSqlite3(session);

const server = async () => {
	const app = express();

	app.use(
		session({
			store: new SQLiteStore({
				db: 'database.sqlite',
				concurrentDB: true,
			}),
			name: 'qid',
			secret: process.env.SESSION_SECRET || 'aslkdfjoiq12312',
			resave: false,
			saveUninitialized: false,
			cookie: {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				maxAge: 1000 * 60 * 60 * 24 * 7 * 365, // 7 years
			},
		})
	);

	// get options from ormconfig.js
	const dbOptions = await getConnectionOptions(process.env.NODE_ENV || 'development');
	await createConnection({ ...dbOptions, name: 'default' });

	const apolloServer = new ApolloServer({
		schema: await buildSchema({
			resolvers: [AuthResolver, MovieResolver, DirectorResolver, ActorResolver],
			validate: false,
		}),
		context: ({ req, res }) => ({ req, res }),
	});

	apolloServer.applyMiddleware({ app, cors: false });
	const port = process.env.PORT || 4000;
	app.listen(port, () => {
		console.log(`server started at http://localhost:${port}/graphql`);
	});
};

void server();
