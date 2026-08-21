import React from "react";

export default async function Layout(props: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div>{props.children}</div>
    </>
  );
}
