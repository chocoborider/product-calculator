import React, { useState, useEffect } from 'react';
import WeightSelector from '../WeightSelector';
import styles from './ProductList.module.css';

const ProductList = () => {
    const [selectedWeights, setSelectedWeights] = useState({});
    const [selectedProducts, setSelectedProducts] = useState({});
    const [products, setProducts] = useState([]);

    const handleWeightChange = (productName, weight) => {
      setSelectedWeights(prevWeights => ({
          ...prevWeights,
          [productName]: weight
      }));
    };
    const toggleProductSelection = (productName) => {
      setSelectedProducts(prevSelected => ({
          ...prevSelected,
          [productName]: !prevSelected[productName]
      }));
    };
    const calculatePrice = (productName, weight) => {
      const product = products.find(p => p.name === productName);
      return product ? (product.gram_price * weight).toFixed(2) : 0;
    };
    const calculateTotalCost = () => {
      return products.reduce((total, product) => {
          if (selectedProducts[product.name] && selectedWeights[product.name] > 0) {
              return total + parseFloat(calculatePrice(product.name, selectedWeights[product.name]));
          }
          return total;
      }, 0).toFixed(2);
    };
    useEffect(() => {
        fetch('/products-config.json')
            .then((response) => response.json())
            .then((data) => setProducts(data))
            .catch((error) => console.error('Error al cargar los productos:', error));
    }, []);

    return (
        <div>
            {products.map((product) => (
                <div className={styles.product} key={product.name}>
                    <label className={styles.productLabel}>
                    <input
                            type="checkbox"
                            checked={selectedProducts[product.name]}
                            onChange={() => toggleProductSelection(product.name)}
                        />
                        {product.name} ({product.gram_price}$ por gramo)
                    </label>
                    {selectedProducts[product.name] && (
                        <>
                            <WeightSelector
                                weight={selectedWeights[product.name]}
                                onWeightChange={(weight) => handleWeightChange(product.name, weight)}
                            />
                            {selectedWeights[product.name] > 0 && (
                                <div>
                                    Precio: {calculatePrice(product.name, selectedWeights[product.name])}$
                                </div>
                            )}
                        </>
                    )}
                </div>
            ))}
            <div className={styles.totalCost}>
                Costo Total: {calculateTotalCost()}$
            </div>
        </div>
    );
};

export default ProductList;
