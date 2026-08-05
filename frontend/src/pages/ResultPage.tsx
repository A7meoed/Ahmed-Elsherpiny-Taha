import { Link, useLocation, Navigate } from "react-router-dom";

function formatAsLacsOrCrores(price: number): string {
  if (price >= 1e7) return `₹ ${(price / 1e7).toFixed(2)} Cr`;
  if (price >= 1e5) return `₹ ${(price / 1e5).toFixed(2)} Lac`;
  return `₹ ${price.toLocaleString("en-IN")}`;
}

export default function ResultPage() {
  const location = useLocation();
  const predictedPrice = (location.state as { predictedPrice?: number } | null)?.predictedPrice;

  if (predictedPrice === undefined) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="page">
      <h1>Predicted Price</h1>
      <p className="predicted-price">{formatAsLacsOrCrores(predictedPrice)}</p>
      <p className="predicted-price-raw">(₹ {predictedPrice.toLocaleString("en-IN")})</p>
      <Link to="/">Predict another property</Link>
    </main>
  );
}
