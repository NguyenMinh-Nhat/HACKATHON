import React from 'react';

const ProductList = ({ products }) => {
  return (
    <div className="mb-4">
      <h2 className="text-xl font-semibold mb-2">Product List</h2>
      <ul>
        {products.map((product, index) => (
          <li key={index} className="border p-2 mb-2">
            <p>ID: {product.id}</p>
            <p>Name: {product.name}</p>
            <p>Price: {product.price} Lamports</p>
            <p>Seller: {product.seller.toString()}</p>
            <p>Owner: {product.owner.toString()}</p>
            <p>Status: {product.isSold ? 'Sold' : 'Available'}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;