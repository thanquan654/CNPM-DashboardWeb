'use client'

import type React from 'react'

import { useState } from 'react'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Loader2, ShoppingCart } from 'lucide-react'
import { ProductCard } from '@/components/ProductCard'

// Define the product type
type Product = {
	id: string
	name: string
	description: string
	price: number
	image: string
	category: string
}

export default function RecommendationsPage() {
	const [gender, setGender] = useState<string>('all')
	const [paymentMethod, setPaymentMethod] = useState<string>('')
	const [ageRange, setAgeRange] = useState<string>('')
	const [purchaseAmount, setPurchaseAmount] = useState<string>('')
	const [purchaseFrequency, setPurchaseFrequency] = useState<string>('')
	const [previousPurchases, setPreviousPurchases] = useState<string>('')

	const [isLoading, setIsLoading] = useState(false)
	const [products, setProducts] = useState<Product[]>([])
	const [error, setError] = useState<string | null>(null)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsLoading(true)
		setError(null)

		// TODO: Replace with actual API call
		try {
			// In a real application, this would be an actual API call
			// For demonstration, we'll simulate an API response
			await new Promise((resolve) => setTimeout(resolve, 1500))

			// Mock API response
			const mockProducts: Product[] = [
				{
					id: '1',
					name: 'Premium Wireless Headphones',
					description:
						'Noise-cancelling headphones with premium sound quality',
					price: 199.99,
					image: '/placeholder.svg?height=200&width=200',
					category: 'Electronics',
				},
				{
					id: '2',
					name: 'Smart Fitness Watch',
					description:
						'Track your fitness goals with this smart watch',
					price: 149.99,
					image: '/placeholder.svg?height=200&width=200',
					category: 'Wearables',
				},
				{
					id: '3',
					name: 'Organic Cotton T-Shirt',
					description: 'Comfortable and eco-friendly t-shirt',
					price: 29.99,
					image: '/placeholder.svg?height=200&width=200',
					category: 'Clothing',
				},
			]

			setProducts(mockProducts)
		} catch (err) {
			setError(
				'Failed to fetch product recommendations. Please try again.',
			)
			console.error(err)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className="container mx-auto p-6">
			<h1 className="text-2xl font-bold mb-6">
				Gợi ý sản phẩm theo nhóm khách hàng
			</h1>

			<div className="grid md:grid-cols-2 gap-6">
				<Card>
					<CardHeader>
						<CardTitle>Thông tin nhóm khách hàng</CardTitle>
						<CardDescription>
							Nhập các thông tin khách hàng để nhận được đề xuất
							sản phẩm được cá nhân hóa
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="gender">Giới tính</Label>
									<Select
										value={gender}
										onValueChange={setGender}
									>
										<SelectTrigger
											id="gender"
											className="w-full"
										>
											<SelectValue placeholder="Chọn giới tính" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem
												value="all"
												defaultChecked
											>
												Cả 2 giới tính
											</SelectItem>
											<SelectItem value="male">
												Nam
											</SelectItem>
											<SelectItem value="female">
												Nữ
											</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<div className="space-y-2">
									<Label htmlFor="paymentMethod">
										Phương thức thanh toán
									</Label>
									<Select
										value={paymentMethod}
										onValueChange={setPaymentMethod}
									>
										<SelectTrigger
											id="paymentMethod"
											className="w-full"
										>
											<SelectValue placeholder="Chọn phương thức thanh toán" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="cash">
												Tiền mặt
											</SelectItem>
											<SelectItem value="credit-card">
												Thẻ tín dụng
											</SelectItem>
											<SelectItem value="e-wallet">
												Chuyển khoản
											</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="ageRange">
										Khoảng độ tuổi
									</Label>
									<Select
										value={ageRange}
										onValueChange={setAgeRange}
									>
										<SelectTrigger
											id="ageRange"
											className="w-full"
										>
											<SelectValue placeholder="Chọn khoảng độ tuổi" />
										</SelectTrigger>
										<SelectContent>
											{/* TODO: Thêm dữ liệu */}
										</SelectContent>
									</Select>
								</div>

								<div className="space-y-2">
									<Label htmlFor="purchaseAmount">
										Số lượng sản phẩm đã mua
									</Label>
									<Input
										id="purchaseAmount"
										placeholder="70-100"
										value={purchaseAmount}
										onChange={(e) =>
											setPurchaseAmount(e.target.value)
										}
									/>
								</div>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="purchaseFrequency">
										Tần suất mua hàng
									</Label>
									<Select
										value={purchaseFrequency}
										onValueChange={setPurchaseFrequency}
									>
										<SelectTrigger
											id="purchaseFrequency"
											className="w-full"
										>
											<SelectValue placeholder="Chọn tần suất mua hàng" />
										</SelectTrigger>
										<SelectContent>
											{/* TODO: Thêm dữ liệu */}
											<SelectItem value="weekly">
												Hàng tuần
											</SelectItem>
											<SelectItem value="monthly">
												Hàng tháng
											</SelectItem>
											<SelectItem value="annually">
												Hàng năm
											</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<div className="space-y-2">
									<Label htmlFor="previousPurchases">
										Số tiền đã chi tiêu trước đó
									</Label>
									<Input
										id="previousPurchases"
										placeholder="41-50"
										value={previousPurchases}
										onChange={(e) =>
											setPreviousPurchases(e.target.value)
										}
									/>
								</div>
							</div>

							<Button
								type="submit"
								className="w-full"
								disabled={isLoading}
							>
								{isLoading ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Đang lấy gợi ý...
									</>
								) : (
									<>
										<ShoppingCart className="mr-2 h-4 w-4" />
										Gợi ý các sản phẩm phù hợp
									</>
								)}
							</Button>
						</form>
					</CardContent>
				</Card>

				<div className="space-y-4">
					<h2 className="text-xl font-semibold">
						Các sản phẩm phù hợp với nhóm khách hàng
					</h2>

					{error && (
						<div className="bg-destructive/10 text-destructive p-4 rounded-md">
							{error}
						</div>
					)}

					{products.length === 0 && !isLoading && !error ? (
						<div className="text-center p-8 border rounded-md bg-muted/50">
							<p className="text-muted-foreground">
								Nhập các thông tin khách hàng rồi ấn "Gợi ý các
								sản phẩm phù hợp" để nhận được đề xuất sản phẩm
								được cá nhân hóa
							</p>
						</div>
					) : (
						<div className="grid gap-4">
							{products.map((product) => (
								<ProductCard
									key={product.id}
									product={product}
								/>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
