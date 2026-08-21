import { NextResponse } from "next/server";

import { ZodError } from "zod";
import { z } from "zod";

const appEnvironment = z.enum(["foo", "bar"]).parse("foo");

export function makeErrorResponse(error: unknown) {
	if (error instanceof ZodError) {
		return NextResponse.json({ error: "Bad request" }, { status: 400 });
	}

	return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}
