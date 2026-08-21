import { z } from "zod";

import { makeErrorResponse } from "../../../utils/error";

import { NextResponse } from "next/server";

export async function POST() {
	try {
		const fooSchema = z.any();

		const foo = fooSchema.parse({});

		return NextResponse.json(foo, { status: 200 });
	} catch (error) {
		return makeErrorResponse(error);
	}
}
