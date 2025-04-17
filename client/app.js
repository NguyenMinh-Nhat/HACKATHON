import React, { useState, useEffect } from 'react';
import { Connection, PublicKey, SystemProgram } from '@solana/web3.js';
import { AnchorProvider, Program, web3 } from '@project-serum/anchor';
import AddProduct from './components/AddProduct';
import ProductList from './components/ProductList';
import BuyProduct from './components/BuyProduct';

const PROGRAM_ID = new PublicKey('D8zZ4Vh5tjfotLQYES8xGtYkaeU5BDrhyFesjHxiFe7E');
const idl = {
  // Thay bằng IDL của smart contract sau khi build
  // Có thể lấy từ target/idl/product_tracker.json
};

const App = () => {
  const [wallet, setWallet] = useState(null);
  const [program, setProgram] = useState(null);
  const [products, setProducts] = useState([]);

  const connectWallet = async () => {
    try {
      const { solana } = window;
      if (solana && solana.isPhantom) {
        const response = await solana.connect();
        setWallet(response.publicKey);
      } else {
        alert('Please install Phantom Wallet');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  const initializeProgram = async () => {
    const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
    const provider = new AnchorProvider(connection, window.solana, {});
    const program = new Program(idl, PROGRAM_ID, provider);
    setProgram(program);
  };

  const fetchProducts = async () => {
    if (!program) return;
    const accounts = await program.account.product.all();
    setProducts(accounts.map(acc => acc.account));
  };

  useEffect(() => {
    if (wallet) initializeProgram();
  }, [wallet]);

  useEffect(() => {
    fetchProducts();
  }, [program]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Solana Product Tracker</h1>
      {!wallet ? (
        <button
          onClick={connectWallet}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Connect Phantom Wallet
        </button>
      ) : (
        <div>
          <p>Connected: {wallet.toString()}</p>
          <AddProduct program={program} wallet={wallet} fetchProducts={fetchProducts} />
          <ProductList products={products} />
          <BuyProduct program={program} wallet={wallet} fetchProducts={fetchProducts} />
        </div>
      )}
    </div>
  );
};

export default App;