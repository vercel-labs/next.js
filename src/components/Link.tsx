import NextLink from "original-next-link"; // avoid circular dependency with next/link

const Link = ({ href, target, prefetch, children, ...rest }: any) => {
  const shouldPrefetch = target === "_blank" ? false : prefetch;
  if (typeof window !== "undefined") {
    window.console.log("CUSTOM_LINK_USED", href, prefetch);
  }
  return (
    <NextLink data-custom-link="yes" href={href} prefetch={shouldPrefetch} target={target} {...rest}>
      {children}
    </NextLink>
  );
};

export default Link;
