import React, { useState } from 'react';
import { web3 } from '@project-serum/anchor';

const AddProduct = ({ program, wallet, fetchProducts }) => {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  const addProduct = async () => {
    try {
      const [productPda] = await web3.PublicKey.findProgramAddress(
        [Buffer.from('product'), Buffer.from(id)],
        program.programId
      );

      await program.rpc.initializeProduct(id, name, parseInt(price), wallet, {
        accounts: {
          product: productPda,
          seller: wallet,
          systemProgram: web3.SystemProgram.programId,
        },
      });

      alert('Product added successfully!');
      fetchProducts();
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product');
    }
  };

  return (
    <div className="mb-4">
      <h2 className="text-xl font-semibold mb-2">Add Product</h2>
      <input
        type="text"
        placeholder="Product ID"
        value={id}
        onChange={(e) => setId(e.target.value)}
        className="border p-2 mr-2"
      />
      <input
        type="text"
        placeholder="Product Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 mr-2"
      />
      <input
        type="number"
        placeholder="Price (Lamports)"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="border p-2 mr-2"
      />
      <button
        onClick={addProduct}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Add Product
      </button>
    </div>
  );
};

export default AddProduct;