var join, run;
join = (e, t) => e + t,
  run = (rows) => {
    rows.map((s) => join(s.g, s.r));
    return rows.map((s) => (i) => join(s.g, i.l));
  };
export { run };
