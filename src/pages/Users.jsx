import { useEffect, useState } from "react";
import { fetchUsers } from "../services/api";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchUsers();
        setUsers(data);
      } catch (error) {
        console.error("Error loading users:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const addUser = (newUser) => {
    setUsers([...users, { id: users.length + 1, ...newUser }]);
    setShowModal(false); // Close the modal after adding the user
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all users in your platform including their name, email, and phone.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
          >
            Add User
          </button>
        </div>
      </div>

      {/* User Table */}
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Name</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Email</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Phone</th>
                    <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                        <div className="font-medium text-gray-900">
                          {user.name.firstname} {user.name.lastname}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{user.email}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{user.phone}</td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button className="text-blue-600 hover:text-blue-900 mr-4">Edit</button>
                        <button className="text-rose-600 hover:text-rose-900">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Adding a New User */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Add New User</h2>
            <Formik
              initialValues={{ firstname: "", lastname: "", email: "", phone: "" }}
              validationSchema={Yup.object({
                firstname: Yup.string().required("First name is required"),
                lastname: Yup.string().required("Last name is required"),
                email: Yup.string().email("Invalid email").required("Email is required"),
                phone: Yup.string()
                  .matches(/^[0-9]+$/, "Must be only digits")
                  .min(10, "Must be at least 10 digits")
                  .required("Phone number is required"),
              })}
              onSubmit={(values, { resetForm }) => {
                addUser({ name: { firstname: values.firstname, lastname: values.lastname }, ...values });
                resetForm();
              }}
            >
              {({ isSubmitting }) => (
                <Form>
                  <div className="mb-3">
                    <label className="block text-sm font-medium">First Name</label>
                    <Field name="firstname" className="w-full p-2 border rounded" />
                    <ErrorMessage name="firstname" component="div" className="text-red-500 text-sm" />
                  </div>

                  <div className="mb-3">
                    <label className="block text-sm font-medium">Last Name</label>
                    <Field name="lastname" className="w-full p-2 border rounded" />
                    <ErrorMessage name="lastname" component="div" className="text-red-500 text-sm" />
                  </div>

                  <div className="mb-3">
                    <label className="block text-sm font-medium">Email</label>
                    <Field name="email" type="email" className="w-full p-2 border rounded" />
                    <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
                  </div>

                  <div className="mb-3">
                    <label className="block text-sm font-medium">Phone</label>
                    <Field name="phone" className="w-full p-2 border rounded" />
                    <ErrorMessage name="phone" component="div" className="text-red-500 text-sm" />
                  </div>

                  <div className="flex justify-end">
                    <button type="submit" disabled={isSubmitting} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
                      {isSubmitting ? "Adding..." : "Add User"}
                    </button>
                    <button onClick={() => setShowModal(false)} type="button" className="bg-gray-500 text-white px-4 py-2 rounded">
                      Cancel
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </div>
  );
}
