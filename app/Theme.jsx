"use client";
export default function Theme({ children }) {
  return (
    <>
      <style jsx>{`
        #theme {
          background-color: rgb(148 163 184);
        }
      `}</style>
      <div id="theme">{children}</div>
    </>
  );
}
