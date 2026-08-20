import PdfPrinter from "pdfmake";

export async function GET() {
  try {
    const printer = new PdfPrinter({});
    return Response.json({ message: "ok" });
  } catch (error) {
    return Response.json({ error: "something went wrong" });
  }
}
