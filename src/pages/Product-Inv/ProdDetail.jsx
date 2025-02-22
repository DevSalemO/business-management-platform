import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`https://fakestoreapi.com/products/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch product details");
        }
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-xl font-bold mt-8">Error: {error}</div>
    );
  }

  if (!product) {
    return (
      <div className="text-center text-xl font-bold mt-8">
        Product not found.
      </div>
    );
  }

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">
            {product.title}
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Detailed information about the product.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            to="/products"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
          >
            Back to Product List
          </Link>
        </div>
      </div>
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <div className="bg-white p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex justify-center">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-64 h-64 object-contain"
                    />
                  </div>
                  <div>
                    <p className="text-gray-700 mb-4">{product.description}</p>
                    <p className="text-xl font-bold mb-2">
                      ${product.price.toFixed(2)}
                    </p>
                    <p className="text-gray-500 mb-4">
                      Category: {product.category}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
