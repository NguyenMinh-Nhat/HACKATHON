import React, { useState } from 'react';
import { web3 } from '@project-serum/anchor';

const BuyProduct = ({ program, wallet, fetchProducts }) => {
  const [productId, setProductId] = useState('');

  const buyProduct = async () => {
    try {
      const [productPda] = await web3.PublicKey.findProgramAddress(
        [Buffer.from('product'), Buffer.from(productId)],
        program.programId
      );

      const product = await program.account.product.fetch(productPda);
      await program.rpc.buyProduct(product.price, {
        accounts: {
          product: productPda,
          buyer: wallet,
          seller: product.seller,
          systemProgram: web3.SystemProgram.programId,
        },
      });

      alert('Product purchased successfully!');
      fetchProducts();
    } catch (error) {
      console.error('Error buying product:', error);
      alert('Failed to buy product');
    }
  };

  return (
    <div className="mb-4">
      <h2 className="text-xl font-semibold mb-2">Buy Product</h2>
      <input
        type="text"
        placeholder="Product ID"
        value={productId}
        onChange={(e) => setProductId(e.target.value)}
        className="border p-2 mr-2"
      />
      <button
        onClick={buyProduct}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Buy Product
      </button>
    </div>
  );
};

export default BuyProduct;