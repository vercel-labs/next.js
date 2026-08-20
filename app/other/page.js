import Link from "next/link";
import Icon from "../../components/Icon";
import "../../styles/other.css";
export default function Other() {
  return (<div><div id="icon" className="svg-inline--fa">icon</div><div id="box" className="box">box</div><Icon /><Link id="to-home" href="/">home</Link></div>);
}
