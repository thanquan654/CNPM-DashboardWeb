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
import { Check, ChevronsUpDown, Loader2, ShoppingCart } from 'lucide-react'
import { ProductCard } from '@/components/ProductCard'
import { Separator } from '@/components/ui/separator'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import {
	Command,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command'
import { cn } from '@/lib/utils'

// Define the product type

export interface Prediction {
	Color: string
	Item: string
	Probability: number
}

const paymentMethodList = [
	{
		label: 'Venmo',
		value: 'Venmo',
	},
	{
		label: 'PayPal',
		value: 'PayPal',
	},
	{
		label: 'Chuyển khoản ngân hàng',
		value: 'Bank Transfer',
	},
	{
		label: 'Thẻ tín dụng',
		value: 'Credit Card',
	},
	{
		label: 'Thẻ ngân hàng',
		value: 'Debit Card',
	},
]
const categoryList = [
	{
		label: 'Giầy dép',
		value: 'Footwear',
	},
	{
		label: 'Quần áo',
		value: 'Clothing',
	},
	{
		label: 'Áo khoác',
		value: 'Outerwear',
	},
	{
		label: 'Phụ kiện',
		value: 'Accessories',
	},
]
const seasonList = [
	{
		label: 'Mùa xuân',
		value: 'Spring',
	},
	{
		label: 'Mùa hè',
		value: 'Summer',
	},
	{
		label: 'Mùa thu',
		value: 'Fall',
	},
	{
		label: 'Mùa đông',
		value: 'Winter',
	},
]

export default function RecommendationsPage() {
	const [gender, setGender] = useState<string>('All')
	const [paymentMethods, setPaymentMethods] = useState<
		{ label: string; value: string }[]
	>([])
	const [ageRange, setAgeRange] = useState<string>('')
	const [purchaseAmount, setPurchaseAmount] = useState<string>('')
	const [purchaseFrequency, setPurchaseFrequency] = useState<string>('')
	const [previousPurchases, setPreviousPurchases] = useState<string>('')
	const [seasons, setSeasons] = useState<{ label: string; value: string }[]>(
		[],
	)
	const [categorys, setCategorys] = useState<
		{ label: string; value: string }[]
	>([])

	const [isPaymentMethodOpen, setIsPaymentMethodOpen] = useState(false)
	const [isCategoryOpen, setIsCategoryOpen] = useState(false)
	const [isSeasonOpen, setIsSeasonOpen] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [predictions, setPredictions] = useState<Prediction[]>([])
	const [error, setError] = useState<string | null>(null)

	const handleChangePaymentMethod = (item: {
		label: string
		value: string
	}) => {
		setPaymentMethods((prev) =>
			prev.includes(item)
				? prev.filter((i) => i !== item)
				: [...prev, item],
		)
	}
	const handleChangeCategory = (item: { label: string; value: string }) => {
		setCategorys((prev) =>
			prev.includes(item)
				? prev.filter((i) => i !== item)
				: [...prev, item],
		)
	}
	const handleChangeSeason = (item: { label: string; value: string }) => {
		setSeasons((prev) =>
			prev.includes(item)
				? prev.filter((i) => i !== item)
				: [...prev, item],
		)
	}

	const transformInputToReqBody = () => {
		const input = {
			Gender: gender,
			'Preferred Payment Method': paymentMethods,
			Age: ageRange,
			'Purchase Amount (VND)': purchaseAmount,
			'Previous Purchases': previousPurchases,
			'Frequency of Purchases': purchaseFrequency,
			Category: categorys,
			Season: seasons,
		}

		const reqBody = Object.entries(input).reduce(
			(acc: Record<string, unknown>, [key, value]) => {
				if (
					value == null ||
					value === '' ||
					(Array.isArray(value) && value.length === 0)
				) {
					return acc
				}

				if (Array.isArray(value)) {
					acc[key] = value.map((v) => v.value)
				} else {
					if (key === 'Gender') {
						if (value === 'All') {
							acc[key] = ['Male', 'Female']
						} else {
							acc[key] = [value]
						}
					} else {
						acc[key] = value
							.split('-')
							.map((v) => (Number.isNaN(v) ? v : Number(v)))
					}
				}

				return acc
			},
			{},
		)

		return reqBody
	}

	const getRecommendations = async (e: React.FormEvent) => {
		e.preventDefault()

		const reqBody = transformInputToReqBody()

		const respone = await fetch(
			'https://607c-1-53-222-186.ngrok-free.app/predict',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(reqBody),
			},
		)
		const data = await respone.json()

		console.log('🚀 ~ data:', data.predictions)

		return data.predictions
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsLoading(true)
		setError(null)

		// TODO: Replace with actual API call
		try {
			const result = await getRecommendations(e)

			setPredictions(result)
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
												value="All"
												defaultChecked
											>
												Cả 2 giới tính
											</SelectItem>
											<SelectItem value="Male">
												Nam
											</SelectItem>
											<SelectItem value="Female">
												Nữ
											</SelectItem>
										</SelectContent>
									</Select>
								</div>

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
											<SelectItem value="18-18">
												Dưới 18 tuổi
											</SelectItem>
											<SelectItem value="19-30">
												19 - 30 tuổi
											</SelectItem>
											<SelectItem value="31-45">
												31 - 45 tuổi
											</SelectItem>
											<SelectItem value="46-60">
												46 - 60 tuổi
											</SelectItem>
											<SelectItem value="60-60">
												Trên 60 tuổi
											</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="previousPurchases">
										Số lượng sản phẩm đã mua trước đó
									</Label>
									<Input
										id="previousPurchases"
										placeholder="5-10"
										value={previousPurchases}
										onChange={(e) =>
											setPreviousPurchases(e.target.value)
										}
									/>
								</div>

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
											<SelectItem value="1-2">
												Hàng tuần
											</SelectItem>
											<SelectItem value="3-4">
												Hàng tháng
											</SelectItem>
											<SelectItem value="11-13">
												Mỗi 3 tháng
											</SelectItem>
											<SelectItem value="50-54">
												Hàng năm
											</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="purchaseAmount">
										Số tiền đã chi tiêu trước đó
									</Label>
									<Input
										id="purchaseAmount"
										placeholder="100000-500000"
										value={purchaseAmount}
										onChange={(e) =>
											setPurchaseAmount(e.target.value)
										}
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="previousPurchases">
										Phương thức thanh toán yêu thích
									</Label>
									<Popover
										open={isPaymentMethodOpen}
										onOpenChange={setIsPaymentMethodOpen}
									>
										<Button
											variant="outline"
											className="w-full justify-between "
											asChild
										>
											<PopoverTrigger className="truncate">
												{paymentMethods.length === 0 ? (
													<span className="text-gray-500">
														Chọn phương thức thanh
														toán
													</span>
												) : (
													paymentMethods
														.map(
															(method) =>
																method.label,
														)
														.join(', ')
												)}
												<ChevronsUpDown className="ml-2 h-4 w-4 text-gray-500" />
											</PopoverTrigger>
										</Button>
										<PopoverContent className="w-[250px] p-0">
											<Command>
												<CommandInput placeholder="Search..." />
												<CommandList>
													<CommandGroup>
														{paymentMethodList.map(
															(option) => (
																<CommandItem
																	key={
																		option.value
																	}
																	onSelect={() =>
																		handleChangePaymentMethod(
																			option,
																		)
																	}
																	className="cursor-pointer"
																>
																	<Check
																		className={cn(
																			'mr-2 h-4 w-4',
																			paymentMethods.includes(
																				option,
																			)
																				? 'opacity-100'
																				: 'opacity-0',
																		)}
																	/>
																	{
																		option.label
																	}
																</CommandItem>
															),
														)}
													</CommandGroup>
												</CommandList>
											</Command>
										</PopoverContent>
									</Popover>
								</div>
							</div>

							<Separator />

							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="category">Danh mục</Label>
									<Popover
										open={isCategoryOpen}
										onOpenChange={setIsCategoryOpen}
									>
										<Button
											variant="outline"
											className="w-full justify-between "
											asChild
										>
											<PopoverTrigger className="truncate">
												{categorys.length === 0 ? (
													<span className="text-gray-500">
														Chọn danh mục
													</span>
												) : (
													categorys
														.map(
															(item) =>
																item.label,
														)
														.join(', ')
												)}
												<ChevronsUpDown className="ml-2 h-4 w-4 text-gray-500" />
											</PopoverTrigger>
										</Button>
										<PopoverContent className="w-[250px] p-0">
											<Command>
												<CommandList>
													<CommandGroup>
														{categoryList.map(
															(option) => (
																<CommandItem
																	key={
																		option.value
																	}
																	onSelect={() =>
																		handleChangeCategory(
																			option,
																		)
																	}
																	className="cursor-pointer"
																>
																	<Check
																		className={cn(
																			'mr-2 h-4 w-4',
																			categorys.includes(
																				option,
																			)
																				? 'opacity-100'
																				: 'opacity-0',
																		)}
																	/>
																	{
																		option.label
																	}
																</CommandItem>
															),
														)}
													</CommandGroup>
												</CommandList>
											</Command>
										</PopoverContent>
									</Popover>
								</div>

								<div className="space-y-2">
									<Label htmlFor="season">Mùa</Label>
									<Popover
										open={isSeasonOpen}
										onOpenChange={setIsSeasonOpen}
									>
										<Button
											variant="outline"
											className="w-full justify-between "
											asChild
										>
											<PopoverTrigger className="truncate">
												{seasons.length === 0 ? (
													<span className="text-gray-500">
														Chọn mùa
													</span>
												) : (
													seasons
														.map(
															(item) =>
																item.label,
														)
														.join(', ')
												)}
												<ChevronsUpDown className="ml-2 h-4 w-4 text-gray-500" />
											</PopoverTrigger>
										</Button>
										<PopoverContent className="w-[250px] p-0">
											<Command>
												<CommandList>
													<CommandGroup>
														{seasonList.map(
															(option) => (
																<CommandItem
																	key={
																		option.value
																	}
																	onSelect={() =>
																		handleChangeSeason(
																			option,
																		)
																	}
																	className="cursor-pointer"
																>
																	<Check
																		className={cn(
																			'mr-2 h-4 w-4',
																			seasons.includes(
																				option,
																			)
																				? 'opacity-100'
																				: 'opacity-0',
																		)}
																	/>
																	{
																		option.label
																	}
																</CommandItem>
															),
														)}
													</CommandGroup>
												</CommandList>
											</Command>
										</PopoverContent>
									</Popover>
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

					{predictions.length === 0 && !isLoading && !error ? (
						<div className="text-center p-8 border rounded-md bg-muted/50">
							<p className="text-muted-foreground">
								Nhập các thông tin khách hàng rồi ấn "Gợi ý các
								sản phẩm phù hợp" để nhận được đề xuất sản phẩm
								được cá nhân hóa
							</p>
						</div>
					) : (
						<div className="grid gap-4">
							{predictions.map((prediction, index) => (
								<ProductCard key={index} product={prediction} />
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
