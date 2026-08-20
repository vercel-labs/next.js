import Link from "next/link";

export default async function Home2() {
  return (
    <div>
      Regular anchor tags:
      <br />
      <a href="#sometesttarget">
        1. (+ 4.) Click it to see that :target selector changed the style of a
        div
      </a>
      <br />
      <a href="#">
        2. Reset the styling with this link by changing the target to '#'
      </a>
      <br />
      <br />
      Next Link tags:
      <br />
      <Link href="#sometesttarget">
        3. Click it to see that :target selector does not change the style of a
        div if next/link is used
      </Link>
      <br />
      <Link href="#">
        5. Reset the styling with this link by changing the target to '#'. Also
        does not reset the style if regular anchor tag (1./4.) was clicked
        before to set the style.
      </Link>
      <br />
      <br />
      <style>{`
        #sometesttarget:target{
          background: blue;
        }
      `}</style>
      <div id="sometesttarget">I should turn blue after link click</div>
    </div>
  );
}
