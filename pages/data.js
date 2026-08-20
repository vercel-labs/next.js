const Data = (props) => {
  return (
    <div>
      <h1 id="page">Test mobile back</h1>
      <ul>
        {props.data.map((name) => (
          <li key={name}>
            <a>{name}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

Data.getInitialProps = async function () {
  await sleep(1000);
  return { data: ["one", "two", "three", "four", "five", "six"] };
};

export default Data;
