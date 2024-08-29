import { InAppPurchases } from 'expo';

const productIds = ['product_id_1', 'product_id_2']; // Replace with your product IDs

export const setupInAppPurchases = async () => {
  await InAppPurchases.connectAsync();

  const { responseCode, results } = await InAppPurchases.getProductsAsync(productIds);

  if (responseCode === InAppPurchases.IAPResponseCode.OK) {
    console.log('Available products:', results);
  } else {
    console.error('Error fetching products');
  }
};

export const purchaseItem = async (productId) => {
  try {
    const { responseCode } = await InAppPurchases.purchaseItemAsync(productId);
    if (responseCode === InAppPurchases.IAPResponseCode.OK) {
      console.log('Purchase successful');
    } else {
      console.log('Purchase failed');
    }
  } catch (error) {
    console.error('Error purchasing item', error);
  }
};

export const getPurchaseHistory = async () => {
  const history = await InAppPurchases.getPurchaseHistoryAsync();
  return history;
};

export const disconnectInAppPurchases = async () => {
  await InAppPurchases.disconnectAsync();
};

export const handlePurchaseUpdates = async () => {
  const subscription = InAppPurchases.setPurchaseListener(({ responseCode, results }) => {
    if (responseCode === InAppPurchases.IAPResponseCode.OK) {
      results.forEach((purchase) => {
        if (!purchase.acknowledged) {
          console.log(`Successfully purchased ${purchase.productId}`);
          InAppPurchases.finishTransactionAsync(purchase, false);
        }
      });
    } else if (responseCode === InAppPurchases.IAPResponseCode.USER_CANCELED) {
      console.log('User canceled the purchase');
    } else {
      console.error('Error in purchase listener', responseCode);
    }
  });

  return subscription;
};
