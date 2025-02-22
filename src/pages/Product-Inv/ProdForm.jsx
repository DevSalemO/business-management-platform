import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

const productSchema = Yup.object().shape({
  title: Yup.string()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters"),
  price: Yup.number()
    .required("Price is required")
    .positive("Price must be a positive number"),
  description: Yup.string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters"),
  category: Yup.string().required("Category is required"),
});

const AddProductForm = () => {
  const navigate = useNavigate();

  const initialValues = {
    title: "",
    price: "",
    description: "",
    category: "",
    image: "https://via.placeholder.com/150",
  };

  // add new product and log (not saved)
  const handleSubmit = (values) => {
    console.log("Product added:", values);
    navigate("/products");
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add Product</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={productSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched }) => (
          <Form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <Field
                type="text"
                name="title"
                className={`mt-1 block w-full border ${
                  errors.title && touched.title
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-md shadow-sm p-2`}
              />
              <ErrorMessage
                name="title"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Price
              </label>
              <Field
                type="number"
                name="price"
                className={`mt-1 block w-full border ${
                  errors.price && touched.price
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-md shadow-sm p-2`}
              />
              <ErrorMessage
                name="price"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <Field
                as="textarea"
                name="description"
                className={`mt-1 block w-full border ${
                  errors.description && touched.description
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-md shadow-sm p-2`}
              />
              <ErrorMessage
                name="description"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <Field
                type="text"
                name="category"
                className={`mt-1 block w-full border ${
                  errors.category && touched.category
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-md shadow-sm p-2`}
              />
              <ErrorMessage
                name="category"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Image
              </label>
              <Field
                type="text"
                name="image"
                disabled
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-100 cursor-not-allowed"
              />
              <ErrorMessage
                name="image"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Save Product
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddProductForm;
