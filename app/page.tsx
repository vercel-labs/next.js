const FOO = {
  BAR: (...args: any[]) => {
    return ({ children }: { children?: React.ReactNode }) => {
      return (
        <div style={{
          border: "1px solid orange",
          margin: "8px",
        }}>
          <pre>${JSON.stringify(args)}</pre>
          <div>{children}</div>
        </div>
      );
    };
  },
};

export default function Page() {
  return (
    <B>
      <A />
    </B>
  );
}

const small = "8px";

const A = FOO.BAR`
  display: inline-flex;
  width: 16px;
  height: 16px;
`;

const B = FOO.BAR`
  gap: ${small};
  margin-bottom: ${small};
`;
