import { dev } from "$app/environment";
import db from "$lib/server/database/drizzle";
import { sessionTable, topic, userTable } from "$lib/server/database/drizzle-schemas";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { Lucia, TimeSpan } from "lucia";

const adapter = new DrizzlePostgreSQLAdapter(db, sessionTable, userTable);

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		name: "session",
		expires: false, // session cookies have very long lifespan (2 years)
		attributes: {
			secure: !dev,
		},
	},
	sessionExpiresIn: new TimeSpan(30, "d"), // no more active/idle
	getUserAttributes: (attributes) => {
		return {
			userId: attributes.id,
			provider: attributes.provider,
			providerId: attributes.providerId,
			email: attributes.email,
			firstName: attributes.firstName,
			lastName: attributes.lastName,
			role: attributes.role,
			verified: attributes.verified,
			receiveEmail: attributes.receiveEmail,
			token: attributes.token,
		};
	},
});

declare module "lucia" {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: DatabaseUserAttributes;
		//DatabaseSessionAttributes: DatabaseSessionAttributes;
	}
}

interface DatabaseUserAttributes {
	id: string;
	provider: string;
	providerId: string;
	email: string;
	firstName: string;
	lastName: string;
	role: string;
	verified: boolean;
	receiveEmail: boolean;
	token: string;
}

/*interface DatabaseSessionAttributes {
	sessionExpiresIn: number;
}*/
// setup google oauth maybe, but not that important
