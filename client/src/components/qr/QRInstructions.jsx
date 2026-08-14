const QRInstructions = () => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-8">

      <h2 className="text-2xl font-bold mb-6">
        Instructions
      </h2>

      <ol className="list-decimal list-inside space-y-3 text-gray-700">

        <li>Download or print your QR Code.</li>

        <li>Keep it in your wallet or on your phone.</li>

        <li>You can also print it on an ID card or sticker.</li>

        <li>Anyone scanning it will only see your emergency medical information.</li>

        <li>Your personal account remains secure.</li>

      </ol>

    </div>
  );
};

export default QRInstructions;