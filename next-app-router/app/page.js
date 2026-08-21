import fillers from "../../fillers.json";
export default function Page(){return (<main><h1>hello app router</h1>{fillers.map((x,i)=>(<p key={i} style={{height:40}}>{x}</p>))}<p id="needle">unicornmagic</p>{fillers.map((x,i)=>(<p key={"b"+i} style={{height:40}}>{x}</p>))}</main>);}
