import red from "./red.module.css";
import green from "./green.module.css";
export function Boxes() {
  return <div id="box" className={`${red.box} ${green.box}`}>box</div>;
}
