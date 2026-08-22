export default function ModalProduct({ params }) {
  return (
    <div id="modal" className="w-full bg-red-500">
      Modal product {params.id}
    </div>
  );
}
