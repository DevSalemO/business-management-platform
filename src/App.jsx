import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { OrderProvider } from './context/OrderContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Users from './pages/Users';
import SalesModule from './components/SalesModule';
import ProductDetail from '/src/pages/Product-Inv/ProdDetail';
import ProductForm from '/src/pages/Product-Inv/ProdForm';

function App() {
  return (
    <BrowserRouter>
      <OrderProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<Products />} />
			<Route path="products/:id" element={<ProductDetail />} />
			<Route path="products/add" element={<ProductForm />} />
            <Route path="orders" element={<SalesModule />} />
            <Route path="users" element={<Users />} />
          </Route>
        </Routes>
      </OrderProvider>
    </BrowserRouter>
  );
}

export default App;
