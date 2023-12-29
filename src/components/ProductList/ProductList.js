import React, { useState, useEffect } from 'react';
import WeightSelector from '../WeightSelector/WeightSelector';
import styles from './ProductList.module.css';

const ProductList = () => {
    const [selectedWeights, setSelectedWeights] = useState({});
    const [selectedProducts, setSelectedProducts] = useState(new Map());
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [showOnlySelected, setShowOnlySelected] = useState(false);

    const toggleShowSelected = () => {
        setShowOnlySelected(prevShowOnlySelected => !prevShowOnlySelected);
    };

    const displayedProducts = showOnlySelected
        ? filteredProducts.filter(product => selectedProducts.has(product.id))
        : filteredProducts;

    const handleWeightChange = (productId, weight) => {
      setSelectedWeights(prevWeights => ({
          ...prevWeights,
          [productId]: weight
      }));
      console.log('handleWeightChange', productId, weight, selectedWeights);
    };
    const toggleProductSelection = (product) => {
        setSelectedProducts(prevSelected => {
            const isSelected = prevSelected.get(product.id);
            const newSelected = new Map(prevSelected);
            if (isSelected) {
                newSelected.delete(product.id);
            } else {
                newSelected.set(product.id, product);
            }
        console.log('toggleProductSelection', product, selectedProducts)
        return newSelected;
        });
    };
    const calculatePrice = (productId, weight) => {
      const product = products.find(p => p.id === productId);
      return product ? (product.gram_price * weight).toFixed(2) : 0;
    };
    const calculateTotalCost = () => {
      return products.reduce((total, product) => {
          if (selectedProducts.has(product.id) && selectedWeights[product.id] > 0) {
              return total + parseFloat(calculatePrice(product.id, selectedWeights[product.id]));
          }
          return total;
      }, 0).toFixed(2);
    };
    useEffect(() => {
        fetch('/products-config.json')
            .then((response) => response.json())
            .then((data) => setProducts(data.map((product, idx) => ({ ...product, id: idx }))))
            .catch((error) => console.error('Error al cargar los productos:', error));
    }, []);
    useEffect(() => {
        // Filtra los productos basándote en el término de búsqueda
        const results = products.filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        console.log('searchTerm:', searchTerm, 'results:', results);
        setFilteredProducts(results);
    }, [searchTerm, products]);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    return (
        <div className={styles.mainContainer}>
            <div className={styles.topBar}>
                <button className={styles.button} onClick={toggleShowSelected}>
                    {showOnlySelected ? 'Mostrar Todos los Productos' : 'Mostrar Solo Seleccionados'}
                </button>
                <input
                    type="text"
                    placeholder="Buscar producto..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            </div>
            
            {displayedProducts.map((product) => (
                <div className={styles.product} key={product.id}>
                    <label className={styles.productLabel}>
                    <input
                            className={styles.weightInput}
                            type="checkbox"
                            checked={selectedProducts.has(product.id)}
                            onChange={() => toggleProductSelection(product)}
                        />
                        {product.name} ({product.gram_price}$ por gramo) - {product.provider}
                    </label>
                    {selectedProducts.has(product.id) && (
                        <div className={styles.weightSelectorContainer}>
                            <WeightSelector
                                weight={selectedWeights[product.id] || 0}
                                onWeightChange={(weight) => handleWeightChange(product.id, weight)}
                                weightStep={product.weight_step}
                            />
                            {selectedWeights[product.id] > 0 && (
                                <div className={styles.priceContainer}>
                                     Precio: {calculatePrice(product.id, selectedWeights[product.id])}$
                                </div>
                            )}
                        </div>
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
