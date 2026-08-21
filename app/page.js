"use client";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

const schema = {
  openapi: "3.1.0",
  info: { title: "Demo", version: "1.0.0" },
  paths: {
    "/hello": {
      get: {
        responses: {
          200: {
            description: "ok",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Hello" },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Hello: { type: "object", properties: { message: { type: "string" } } },
    },
  },
};

export default function Home() {
  return (
    <main>
      <SwaggerUI spec={schema} />
    </main>
  );
}
