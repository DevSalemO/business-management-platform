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
    // Generate a unique numeric ID using timestamp
    // Using timestamp in milliseconds and a random number between 1-999
    const uniqueId = parseInt(Date.now().toString().slice(-9) + Math.floor(Math.random() * 999 + 1).toString().padStart(3, '0'));

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

    // Return enhanced order data with our unique numeric ID
    return {
      ...response.data,
      id: uniqueId, // Use our generated unique numeric ID
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
    // For orders from the API (usually smaller IDs), try to delete from API
    // For our generated orders (larger IDs), just return success
    if (orderId.toString().length <= 6) {
      await axios.delete(`${API_URL}/carts/${orderId}`);
    }
    return orderId;
  } catch (error) {
    console.error('Error deleting order:', error);
    throw error;
  }
};

export const fetchOrderById = async (orderId) => {
  try {
    // For locally generated orders (longer IDs), get from localStorage
    if (orderId.toString().length > 6) {
      const savedOrders = localStorage.getItem('orders');
      if (savedOrders) {
        const orders = JSON.parse(savedOrders);
        const order = orders.find(o => o.id === orderId);
        if (order) {
          return order; // Local orders already have all the details we need
        }
      }
      throw new Error('Order not found in local storage');
    }

    // For API orders (shorter IDs), fetch from API
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

// Users CRUD operations
export const createUser = async (userData) => {
  try {
    const uniqueId = parseInt(Date.now().toString().slice(-9) + Math.floor(Math.random() * 999 + 1).toString().padStart(3, '0'));
    const newUser = {
      id: uniqueId,
      ...userData
    };

    // Store in localStorage
    const savedUsers = localStorage.getItem('users') || '[]';
    const users = JSON.parse(savedUsers);
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    return newUser;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const updateUser = async (userId, userData) => {
  try {
    const savedUsers = localStorage.getItem('users') || '[]';
    let users = JSON.parse(savedUsers);
    
    const index = users.findIndex(user => user.id === userId);
    if (index !== -1) {
      users[index] = { ...users[index], ...userData };
      localStorage.setItem('users', JSON.stringify(users));
      return users[index];
    }
    throw new Error('User not found');
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    const savedUsers = localStorage.getItem('users') || '[]';
    let users = JSON.parse(savedUsers);
    
    users = users.filter(user => user.id !== userId);
    localStorage.setItem('users', JSON.stringify(users));
    
    return userId;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

// Products CRUD operations
export const createProduct = async (productData) => {
  try {
    const uniqueId = parseInt(Date.now().toString().slice(-9) + Math.floor(Math.random() * 999 + 1).toString().padStart(3, '0'));
    const newProduct = {
      id: uniqueId,
      ...productData
    };

    // Store in localStorage
    const savedProducts = localStorage.getItem('products') || '[]';
    const products = JSON.parse(savedProducts);
    products.push(newProduct);
    localStorage.setItem('products', JSON.stringify(products));

    return newProduct;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

export const updateProduct = async (productId, productData) => {
  try {
    const savedProducts = localStorage.getItem('products') || '[]';
    let products = JSON.parse(savedProducts);
    
    const index = products.findIndex(product => product.id === productId);
    if (index !== -1) {
      products[index] = { ...products[index], ...productData };
      localStorage.setItem('products', JSON.stringify(products));
      return products[index];
    }
    throw new Error('Product not found');
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const deleteProduct = async (productId) => {
  try {
    const savedProducts = localStorage.getItem('products') || '[]';
    let products = JSON.parse(savedProducts);
    
    products = products.filter(product => product.id !== productId);
    localStorage.setItem('products', JSON.stringify(products));
    
    return productId;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};
