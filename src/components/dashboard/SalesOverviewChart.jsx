import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from "framer-motion";

const API_URL = 'https://fakestoreapi.com';

const SalesOverviewChart = () => {
	const [salesData, setSalesData] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchSalesData = async () => {
			try {
				// Fetch all carts
				const response = await axios.get(`${API_URL}/carts`);
				const carts = response.data;

				// Fetch products for price information
				const productsResponse = await axios.get(`${API_URL}/products`);
				const products = productsResponse.data;
				const productMap = products.reduce((acc, product) => {
					acc[product.id] = product;
					return acc;
				}, {});

				// Process carts to get monthly sales for 2020
				const monthlySales = Array(12).fill(0);
				carts.forEach(cart => {
					const date = new Date(cart.date);
					if (date.getFullYear() === 2020) {
						const month = date.getMonth();
						const totalSales = cart.products.reduce((sum, product) => {
							const productPrice = productMap[product.productId]?.price || 0;
							return sum + (productPrice * product.quantity);
						}, 0);
						monthlySales[month] += totalSales;
					}
				});

				// Create formatted data for the chart
				const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
				const formattedData = months.map((month, index) => ({
					name: month,
					sales: Number(monthlySales[index].toFixed(2))
				}));

				setSalesData(formattedData);
				setLoading(false);
			} catch (error) {
				console.error('Error fetching sales data:', error);
				setLoading(false);
			}
		};

		fetchSalesData();
	}, []);

	if (loading) {
		return (
			<motion.div
				className='bg-white-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.2 }}
			>
				<h2 className='text-lg font-medium mb-4 text-black-100'>Sales Overview</h2>
				<div className='h-80 flex items-center justify-center'>
					<p className="text-gray-500">Loading...</p>
				</div>
			</motion.div>
		);
	}

	return (
		<motion.div
			className='bg-white-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2 }}
		>
			<h2 className='text-lg font-medium mb-4 text-black-100'>Sales Overview</h2>
			<div className='h-80'>
				<ResponsiveContainer width="100%" height="100%">
					<LineChart data={salesData}>
						<CartesianGrid strokeDasharray='3 3' stroke='#E5E7EB' />
						<XAxis 
							dataKey="name" 
							stroke='#6B7280'
							tick={{ fill: '#374151' }}
						/>
						<YAxis 
							stroke='#6B7280'
							tick={{ fill: '#374151' }}
							tickFormatter={(value) => `$${value}`}
						/>
						<Tooltip
							contentStyle={{
								backgroundColor: "white",
								borderColor: "#E5E7EB",
								borderRadius: "0.375rem",
								boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)"
							}}
							itemStyle={{ color: "#111827" }}
							formatter={(value) => [`$${value}`, "Sales"]}
						/>
						<Line
							type='monotone'
							dataKey='sales'
							stroke='#6366F1'
							strokeWidth={3}
							dot={{ fill: "#6366F1", strokeWidth: 2, r: 4 }}
							activeDot={{ r: 6, strokeWidth: 2 }}
						/>
					</LineChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
};

export default SalesOverviewChart;