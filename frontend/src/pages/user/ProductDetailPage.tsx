import { useParams, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store'
import { useEffect, useMemo, useState } from 'react'
import { fetchProducts, type Product } from '@/store/productsSlice'
import { addToCart } from '@/store/cartSlice'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Check } from 'lucide-react'
import { toast } from 'sonner'

export default function ProductDetailPage() {
	const { id } = useParams()
	const dispatch = useAppDispatch()
	const navigate = useNavigate()
	const { items, loading } = useAppSelector(s => s.products)
	const { items: cartItems } = useAppSelector(s => s.cart)
	const [size, setSize] = useState<'S' | 'M' | 'L' | 'XL' | null>(null)
	const [itemAdded, setItemAdded] = useState(false)

	const product: Product | undefined = useMemo(() => {
		const pid = parseInt(id || '', 10)
		return items.find(p => p.id === pid)
	}, [items, id])

	useEffect(() => {
		if (!items || items.length === 0) dispatch(fetchProducts())
	}, [dispatch])

	// Reset itemAdded state when component unmounts (user leaves page)
	useEffect(() => {
		return () => {
			setItemAdded(false)
		}
	}, [])

	// Check if current product is still in cart and update itemAdded state
	useEffect(() => {
		if (product && itemAdded) {
			const isInCart = cartItems.some(item => item.id === product.id)
			if (!isInCart) {
				setItemAdded(false)
			}
		}
	}, [cartItems, product, itemAdded])


	const toSrc = (url?: string | null) => {
		if (!url) return ''
		const base = import.meta.env.VITE_API_URL || 'http://localhost:5000'
		return url.startsWith('http') ? url : `${base}${url}`
	}

	const handleAddToCart = () => {
		if (!product) return
		if (!size) return
		
		const cartItem = { 
			id: product.id, 
			name: product.name, 
			price: product.price, 
			quantity: 1, 
			image_url: toSrc(product.image_url), 
			category: product.category,
			size: size // Include the selected size
		};
		
		console.log('Adding to cart with size:', cartItem);
		dispatch(addToCart(cartItem))
		
		// Show confirmation message on the page (stays until user leaves)
		setItemAdded(true)
		
		// Show red capsule toast notification
		toast.success("Item Added To Cart", {
			style: {
				background: '#dc2626', // full red background
				color: '#ffffff', // white text
				fontWeight: 'bold', // bold text
				borderRadius: '9999px', // capsule shape
				padding: '10px 16px',
				fontSize: '14px',
				border: 'none',
				boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
				width: 'fit-content',
				minWidth: 'auto'
			}
		})
	}

	const handleGoBack = () => {
		// Check if there's a previous page in history
		if (window.history.length > 1) {
			navigate(-1)
		} else {
			// Fallback to home page if no history
			navigate('/')
		}
	}

	if (loading && !product) {
		return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>
	}

	if (!product) {
		return (
			<div className="min-h-screen bg-black text-white flex items-center justify-center">
				<div className="text-center">
					<p className="mb-4">Product not found.</p>
					<Button onClick={() => navigate(-1)}>Go Back</Button>
				</div>
			</div>
		)
	}

	const activeSrc = toSrc(product.image_url)

	return (
		<div className="product-detail-page bg-black min-h-screen">
			<div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 pt-4 pb-8 w-full">
				{/* Header */}
				<div className="mt-16 sm:mt-20 mb-3 sm:mb-4">
					<div className="flex items-center gap-3 sm:gap-4">
						<Button
							onClick={handleGoBack}
							variant="ghost"
							className="text-white hover:bg-white/10 p-1.5 sm:p-2"
						>
							<ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
						</Button>
						<h1 className="text-lg sm:text-xl lg:text-2xl font-semibold text-white">Product Details</h1>
					</div>
				</div>

				{/* Main Product Container */}
				<div className="bg-transparent rounded-xl sm:rounded-2xl border border-white p-3 sm:p-4 lg:p-6 min-h-fit">

					<div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-12">
						{/* Left Side - Product Image */}
						<div className="w-full lg:w-2/5">
							{/* Main Product Image */}
							<div className="w-full h-40 sm:h-56 md:h-72 lg:h-96 rounded-lg sm:rounded-xl overflow-hidden bg-transparent border border-white">
								{activeSrc ? (
									<img 
										src={activeSrc}
										alt={product.name}
										className="w-full h-full object-cover"
									/>
								) : (
									<div className="w-full h-full flex items-center justify-center text-gray-400">
										<span className="text-sm sm:text-base lg:text-lg">Product Image</span>
									</div>
								)}
							</div>
						</div>

						{/* Right Side - Product Details */}
						<div className="w-full lg:w-3/5">
							<div className="flex flex-col xl:flex-row gap-4 sm:gap-6 lg:gap-8">
								{/* Main Product Info */}
								<div className="flex-1">
									{/* Product Name */}
									<h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-3 sm:mb-4">{product.name}</h2>
									
									{/* Price */}
									<div className="mb-4 sm:mb-6">
										{product.isOnSale && product.originalPrice ? (
											<div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
												<span className="text-2xl sm:text-3xl font-bold text-white">${product.price.toFixed(2)}</span>
												<span className="text-lg sm:text-xl text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
												<span className="bg-red-100 text-red-600 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium w-fit">
													{product.discount}% OFF
												</span>
											</div>
										) : (
											<span className="text-2xl sm:text-3xl font-bold text-white">${product.price.toFixed(2)}</span>
										)}
									</div>
									
									{/* Description Box */}
									<div className="bg-transparent border border-white rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6 lg:mb-8">
										<h3 className="text-base sm:text-lg font-semibold text-white mb-2 sm:mb-3">Description</h3>
										<p className="text-sm sm:text-base text-gray-300 leading-relaxed">
											{product.description || 'Premium footwear crafted for comfort and style. Perfect for everyday wear and special occasions.'}
										</p>
									</div>

									{/* Size Details */}
									<div className="mb-4 sm:mb-6 lg:mb-8">
										<h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Size Details</h3>
										<div className="flex gap-2 sm:gap-3 mb-4 sm:mb-6">
											{(['S','M','L','XL'] as const).map(s => (
												<button
													key={s}
													onClick={() => setSize(s)}
													className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg border-2 font-semibold text-xs sm:text-sm transition-all ${
														size === s 
															? 'bg-white-500 text-white border-yellow-500' 
															: 'bg-transparent text-white border-white hover:border-yellow-300'
													}`}
												>
													{s}
												</button>
											))}
										</div>
										
										{/* Add to Cart Button */}
										<Button 
											className="bg-White hover:bg-yellow-700 text-white px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base lg:text-lg font-semibold rounded-l transition-all shadow-sm border-2 border-white hover:border-yellow-950 w-full sm:w-auto"

											onClick={handleAddToCart} 
											disabled={!size}
										>
											Add to Cart
										</Button>
										
										{/* Confirmation Message */}
										{itemAdded && (
											<div className="mt-3 sm:mt-4 flex items-center justify-center space-x-2 bg-green-600 text-white px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium animate-pulse">
												<Check className="h-3 w-3 sm:h-4 sm:w-4" />
												<span>Item added to cart - Want more?</span>
											</div>
										)}
									</div>
								</div>

								{/* Product Info Card */}
								<div className="w-full xl:w-80 flex-shrink-0">
									<div className="bg-transparent border border-white rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6">
										<h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Product Info</h3>
										<div className="space-y-3 sm:space-y-4">
											<div className="flex justify-between">
												<span className="text-xs sm:text-sm text-gray-300">Category:</span>
												<span className="font-medium text-white capitalize text-xs sm:text-sm">{product.category}</span>
											</div>
											<div className="flex justify-between">
												<span className="text-xs sm:text-sm text-gray-300">Sold:</span>
												<span className="font-medium text-white text-xs sm:text-sm">{product.buyCount || 0} units</span>
											</div>
											<div className="flex justify-between">
												<span className="text-xs sm:text-sm text-gray-300">Status:</span>
												<span className="font-medium text-green-400 text-xs sm:text-sm">In Stock</span>
											</div>
											<div className="flex justify-between items-center">
												<span className="text-xs sm:text-sm text-gray-300">Rating:</span>
												<div className="flex items-center gap-1">
													<span className="text-yellow-400 text-sm sm:text-lg">★★★★☆</span>
													<span className="text-gray-300 text-xs sm:text-sm ml-1">(4.2)</span>
												</div>
											</div>
										</div>
										
										{/* Additional Info */}
										<div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-white">
											<div className="space-y-2 text-xs sm:text-sm text-gray-300">
												<div className="flex items-center gap-2">
													<span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full"></span>
													<span>Free shipping on orders over $50</span>
												</div>
												<div className="flex items-center gap-2">
													<span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full"></span>
													<span>30-day return policy</span>
												</div>
												<div className="flex items-center gap-2">
													<span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-400 rounded-full"></span>
													<span>Premium quality guarantee</span>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
