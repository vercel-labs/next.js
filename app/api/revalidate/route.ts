import { revalidatePath, revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function GET(request: NextRequest): Promise<NextResponse> {
  const revalidate = request.nextUrl.searchParams.get("revalidate");
  const type = request.nextUrl.searchParams.get("type");

  if (!revalidate) {
    return Promise.resolve(
      NextResponse.json({
        revalidated: false,
      })
    );
  }

  switch (type) {
    case "path": {
      revalidatePath(revalidate);
      break;
    }
    case "tag": {
      revalidateTag(revalidate, "max");
      break;
    }
    default: {
      return Promise.resolve(
        NextResponse.json({
          revalidated: false,
        })
      );
    }
  }

  return Promise.resolve(
    NextResponse.json({
      revalidated: true,
    })
  );
}
