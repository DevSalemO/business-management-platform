import axios from 'axios';

const API_URL = 'https://fakestoreapi.com';

export const fetchOrders = async () => {
  try {
    const response = await axios.get(`${API_URL}/carts?limit=5`); // Limiting to 5 orders for demo
    const orders = response.data;
    
    // Fetch all users and products in parallel
    const [users, products] = await Promise.all([
      axios.get(`${API_URL}/users`),
      axios.get(`${API_URL}/products`),
    ]);

    // Map products and users to their IDs for easy lookup
    const productMap = products.data.reduce((acc, product) => {
      acc[product.id] = product;
      return acc;
    }, {});

    const userMap = users.data.reduce((acc, user) => {
      acc[user.id] = user;
      return acc;
    }, {});

    // Enhance orders with user and product details
    const enhancedOrders = orders.map(order => {
      // Calculate total price for the order
      const totalPrice = order.products.reduce((sum, product) => {
        const productDetails = productMap[product.productId];
        return sum + (productDetails?.price || 0) * product.quantity;
      }, 0);

      return {
        ...order,
        user: userMap[order.userId],
        totalPrice,
        products: order.products.map(product => ({
          ...product,
          details: productMap[product.productId],
        })),
      };
    });

    return enhancedOrders;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

export const createOrder = async (orderData) => {
  try {
    // Get the specific user details
    const userResponse = await axios.get(`${API_URL}/users/${orderData.userId}`);
    const user = userResponse.data;

    // Get specific product details for each product in the order
    const productDetails = await Promise.all(
      orderData.products.map(product =>
        axios.get(`${API_URL}/products/${product.productId}`)
      )
    );

    const productMap = productDetails.reduce((acc, response, index) => {
      acc[orderData.products[index].productId] = response.data;
      return acc;
    }, {});

    // Calculate total price
    const totalPrice = orderData.products.reduce((sum, product) => {
      const productDetail = productMap[product.productId];
      return sum + (productDetail?.price || 0) * product.quantity;
    }, 0);

    // Create the order
    const response = await axios.post(`${API_URL}/carts`, {
      userId: parseInt(orderData.userId),
      date: orderData.date,
      products: orderData.products.map(product => ({
        productId: parseInt(product.productId),
        quantity: parseInt(product.quantity)
      }))
    });

    // Return enhanced order data
    return {
      ...response.data,
      user,
      totalPrice,
      products: orderData.products.map(product => ({
        ...product,
        details: productMap[product.productId]
      })),
      date: orderData.date
    };
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const deleteOrder = async (orderId) => {
  try {
    await axios.delete(`${API_URL}/carts/${orderId}`);
    return orderId;
  } catch (error) {
    console.error('Error deleting order:', error);
    throw error;
  }
};

export const fetchOrderById = async (orderId) => {
  try {
    const response = await axios.get(`${API_URL}/carts/${orderId}`);
    const order = response.data;

    // Fetch user and product details
    const [user, ...productDetails] = await Promise.all([
      axios.get(`${API_URL}/users/${order.userId}`),
      ...order.products.map(product =>
        axios.get(`${API_URL}/products/${product.productId}`)
      )
    ]);

    const productMap = productDetails.reduce((acc, response, index) => {
      acc[order.products[index].productId] = response.data;
      return acc;
    }, {});

    // Calculate total price
    const totalPrice = order.products.reduce((sum, product) => {
      const productDetail = productMap[product.productId];
      return sum + (productDetail?.price || 0) * product.quantity;
    }, 0);

    return {
      ...order,
      user: user.data,
      totalPrice,
      products: order.products.map(product => ({
        ...product,
        details: productMap[product.productId]
      }))
    };
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
};

export const fetchProducts = async () => {
  try {
    // Get all products with full details
    const response = await axios.get(`${API_URL}/products`);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const fetchUsers = async () => {
  try {
    // Get all users with full details
    const response = await axios.get(`${API_URL}/users`);
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};
