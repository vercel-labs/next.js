export const dynamic = "force-dynamic";
const UA_IOS =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
const W = [100, 200, 300, 400, 500];
export default async function Compare() {
  const res = await fetch(
    "https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500&display=swap",
    { headers: { "user-agent": UA_IOS }, cache: "no-store" }
  );
  const css = (await res.text()).replace(/'Poppins'/g, "'PoppinsGoogle'");
  return (
    <div style={{ fontSize: 28 }}>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      {W.map((w) => (
        <div key={w} style={{ display: "flex" }}>
          <p id={`n${w}`} style={{ fontWeight: w, margin: 4, width: 400 }}>Handgloves {w}</p>
          <p id={`g${w}`} style={{ fontWeight: w, margin: 4, width: 400, fontFamily: "PoppinsGoogle" }}>Handgloves {w}</p>
        </div>
      ))}
    </div>
  );
}
