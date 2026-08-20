export default function DynamicPage({ slug }) {
  return (
    <h1>
      Slug is {slug}
    </h1>
  )
}

export async function getStaticPaths() {
  return { paths: [{ params: { slug: "test" } }], fallback: "blocking" };
}

export async function getStaticProps(context) {
  const { params: { slug } } = context;
  let redirect;

  try {
    const res = await fetch("http://localhost:3000/api/redirect");
    const data = await res.json()
    redirect = data.redirect;
  } catch (err) {
    redirect = false;
  }

  if (redirect) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
      revalidate: 1,
    };
  }

  return { props: { slug }, revalidate: 1 };
}
