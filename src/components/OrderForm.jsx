import { useEffect, useState } from 'react';
import { Formik, Form, Field, FieldArray } from 'formik';
import * as Yup from 'yup';
import { fetchProducts, fetchUsers, createOrder } from '../services/api';
import { useOrders } from '../context/OrderContext';

const OrderSchema = Yup.object().shape({
  userId: Yup.string()
    .required('Customer is required'),
  products: Yup.array()
    .of(
      Yup.object().shape({
        productId: Yup.string()
          .required('Product is required'),
        quantity: Yup.number()
          .required('Quantity is required')
          .min(1, 'Quantity must be at least 1')
          .max(100, 'Quantity cannot exceed 100')
      })
    )
    .min(1, 'At least one product is required')
});

export default function OrderForm() {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const { addOrder } = useOrders();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [fetchedUsers, fetchedProducts] = await Promise.all([
          fetchUsers(),
          fetchProducts()
        ]);
        setUsers(fetchedUsers);
        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const initialValues = {
    userId: '',
    products: [{ productId: '', quantity: 1 }],
    date: new Date().toISOString()
  };

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    try {
      const newOrder = await createOrder(values);
      addOrder(newOrder);
      resetForm();
      alert('Order created successfully!');
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to create order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Create New Order</h2>
      
      <Formik
        initialValues={initialValues}
        validationSchema={OrderSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, isSubmitting }) => (
          <Form className="space-y-6">
            <div>
              <label htmlFor="userId" className="block text-sm font-medium text-gray-700">
                Customer
              </label>
              <Field
                as="select"
                name="userId"
                className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md ${
                  errors.userId && touched.userId ? 'border-red-500' : ''
                }`}
              >
                <option value="">Select a customer</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {`${user.name.firstname} ${user.name.lastname}`}
                  </option>
                ))}
              </Field>
              {errors.userId && touched.userId && (
                <div className="mt-1 text-sm text-red-600">{errors.userId}</div>
              )}
            </div>

            <FieldArray name="products">
              {({ push, remove }) => (
                <div className="space-y-4">
                  {values.products.map((_, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="flex-1">
                        <label
                          htmlFor={`products.${index}.productId`}
                          className="block text-sm font-medium text-gray-700"
                        >
                          Product
                        </label>
                        <Field
                          as="select"
                          name={`products.${index}.productId`}
                          className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md ${
                            errors.products?.[index]?.productId && touched.products?.[index]?.productId
                              ? 'border-red-500'
                              : ''
                          }`}
                        >
                          <option value="">Select a product</option>
                          {products.map(product => (
                            <option key={product.id} value={product.id}>
                              {product.title}
                            </option>
                          ))}
                        </Field>
                        {errors.products?.[index]?.productId && touched.products?.[index]?.productId && (
                          <div className="mt-1 text-sm text-red-600">
                            {errors.products[index].productId}
                          </div>
                        )}
                      </div>

                      <div className="w-32">
                        <label
                          htmlFor={`products.${index}.quantity`}
                          className="block text-sm font-medium text-gray-700"
                        >
                          Quantity
                        </label>
                        <Field
                          type="number"
                          name={`products.${index}.quantity`}
                          className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md ${
                            errors.products?.[index]?.quantity && touched.products?.[index]?.quantity
                              ? 'border-red-500'
                              : ''
                          }`}
                        />
                        {errors.products?.[index]?.quantity && touched.products?.[index]?.quantity && (
                          <div className="mt-1 text-sm text-red-600">
                            {errors.products[index].quantity}
                          </div>
                        )}
                      </div>

                      {values.products.length > 1 && (
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="bg-rose-100 text-rose-600 hover:bg-rose-200 px-3 py-1.5 rounded-md font-medium inline-flex items-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                          Remove
                        </button>
                      )}
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => push({ productId: '', quantity: 1 })}
                    className="mt-2 inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Add Product
                  </button>
                </div>
              )}
            </FieldArray>

            <div className="pt-5">
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`ml-3 inline-flex justify-center py-2 px-4 text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {isSubmitting ? 'Creating...' : 'Create Order'}
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
