import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import Form from "next/form";

export function LinkMore(props: {
  replace?: boolean;
  scroll?: boolean;
  prefetch?: boolean;
  as?: string;
  onMouseEnter?: React.MouseEventHandler<HTMLAnchorElement>;
}) {
  return (
    <Link
      href="/x"
      as={props.as}
      replace={props.replace}
      scroll={props.scroll}
      prefetch={props.prefetch}
      onMouseEnter={props.onMouseEnter}
    >
      x
    </Link>
  );
}

export function ImageMore(props: { priority?: boolean; quality?: number; onLoad?: React.ReactEventHandler<HTMLImageElement> }) {
  return <Image src="/a.png" alt="a" width={10} height={10} priority={props.priority} quality={props.quality} onLoad={props.onLoad} />;
}

export function ScriptMore(props: { strategy?: "afterInteractive" | "lazyOnload" }) {
  return <Script src="/a.js" strategy={props.strategy} />;
}

export function FormMore(props: { replace?: boolean; scroll?: boolean }) {
  return <Form action="/s" replace={props.replace} scroll={props.scroll}>x</Form>;
}
