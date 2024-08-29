import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { InAppPurchases } from 'expo';
import { setupInAppPurchases, purchaseItem, disconnectInAppPurchases } from '../utils/IAPUtils'; // Update with your actual file path
import { getAuth } from 'firebase/auth'; // Import Firebase auth methods
import { app } from '../config/firebaseConfig'; // Import initialized Firebase app

const productIds = ['product_id_1', 'product_id_2']; // Replace with your product IDs

const PurchaseScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const auth = getAuth(app);

  useEffect(() => {
    const checkAuth = () => {
      const user = auth.currentUser;
      if (!user) {
        navigation.navigate('SignIn');
      } else {
        fetchProducts();
      }
    };

    const fetchProducts = async () => {
      await setupInAppPurchases();

      const { responseCode, results } = await InAppPurchases.getProductsAsync(productIds);

      if (responseCode === InAppPurchases.IAPResponseCode.OK) {
        console.log('Available products:', results);
        setProducts(results);
      } else {
        console.error('Error fetching products');
      }

      setIsLoading(false);
    };

    checkAuth();

    return () => {
      disconnectInAppPurchases();
    };
  }, [navigation]);

  const handlePurchase = async (productId) => {
    await purchaseItem(productId);
    // Handle success or failure logic here
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Purchase Premium</Text>
      <View style={styles.productsContainer}>
        {products.map((product) => (
          <TouchableOpacity
            key={product.productId}
            style={styles.productButton}
            onPress={() => handlePurchase(product.productId)}
          >
            <Text style={styles.productText}>{product.title}</Text>
            <Text style={styles.productText}>{product.price}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF8DC',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  productsContainer: {
    width: '80%',
    marginTop: 20,
  },
  productButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#DDDDDD',
    borderRadius: 10,
  },
  productText: {
    fontSize: 18,
  },
});

export default PurchaseScreen;
