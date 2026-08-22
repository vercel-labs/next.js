export const dynamic = "force-dynamic";
export async function GET(_req, { params }) {
  const { id } = await params;
  return Response.json({
    id: Number(id),
    title: "Product " + id,
    price: 10 + Number(id),
    description: "description for product " + id,
  });
}
