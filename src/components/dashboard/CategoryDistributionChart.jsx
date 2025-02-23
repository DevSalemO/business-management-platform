import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useState, useEffect } from 'react';
import axios from 'axios';

const COLORS = ["#6366F1", "#8B5CF6", "#EC4899", "#10B981", "#F59E0B"];
const API_URL = 'https://fakestoreapi.com';

const CategoryDistributionChart = () => {
	const [categoryData, setCategoryData] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchCategoryData = async () => {
			try {
				// Fetch both carts and products
				const [cartsResponse, productsResponse] = await Promise.all([
					axios.get(`${API_URL}/carts`),
					axios.get(`${API_URL}/products`)
				]);

				const carts = cartsResponse.data;
				const products = productsResponse.data;

				// Create a map of products by ID for easy lookup
				const productMap = products.reduce((acc, product) => {
					acc[product.id] = product;
					return acc;
				}, {});

				// Calculate sales by category
				const categorySales = {};

				// Process each cart
				carts.forEach(cart => {
					cart.products.forEach(item => {
						const product = productMap[item.productId];
						if (product) {
							const category = product.category;
							const saleAmount = product.price * item.quantity;
							categorySales[category] = (categorySales[category] || 0) + saleAmount;
						}
					});
				});

				// Transform into chart data format and sort by sales value
				const transformedData = Object.entries(categorySales)
					.map(([name, value]) => ({
						name: name.charAt(0).toUpperCase() + name.slice(1),
						value: Number(value.toFixed(2))
					}))
					.sort((a, b) => b.value - a.value);

				setCategoryData(transformedData);
				setLoading(false);
			} catch (error) {
				console.error('Error fetching category data:', error);
				setLoading(false);
			}
		};

		fetchCategoryData();
	}, []);

	if (loading) {
		return (
			<div>
				<h2 className='text-lg font-medium mb-4 text-gray-900'>Sales by Category</h2>
				<div className='h-[400px] flex items-center justify-center'>
					<p className="text-gray-500">Loading...</p>
				</div>
			</div>
		);
	}

	return (
		<div>
			<h2 className='text-lg font-medium mb-4 text-gray-900'>Sales by Category</h2>
			<div className='h-[400px]'>
				<ResponsiveContainer width="100%" height="100%">
					<PieChart>
						<Pie
							data={categoryData}
							cx="50%"
							cy="50%"
							labelLine={false}
							outerRadius={120}
							fill='#8884d8'
							dataKey='value'
							label={({ name, value, percent }) => 
								`${name} ($${value}) ${(percent * 100).toFixed(0)}%`
							}
						>
							{categoryData.map((entry, index) => (
								<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
							))}
						</Pie>
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
						<Legend formatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)} />
					</PieChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
};

export default CategoryDistributionChart;