import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart } from 'lucide-react'

type Product = {
	id: string
	name: string
	description: string
	price: number
	image: string
	category: string
}

interface ProductCardProps {
	product: Product
}

export function ProductCard({ product }: ProductCardProps) {
	return (
		<Card className="overflow-hidden">
			<div className="aspect-video relative">
				<img
					src={product.image || '/placeholder.svg'}
					alt={product.name}
					className="object-cover"
				/>
			</div>
			<CardHeader className="p-4">
				<div className="flex justify-between items-start">
					<div>
						<CardTitle className="text-lg">
							{product.name}
						</CardTitle>
						<CardDescription className="line-clamp-2">
							{product.description}
						</CardDescription>
					</div>
					<Badge variant="outline">{product.category}</Badge>
				</div>
			</CardHeader>
			<CardFooter className="p-4 pt-0 flex justify-between items-center">
				<div className="font-bold text-lg">
					${product.price.toFixed(2)}
				</div>
				<Button size="sm">
					<ShoppingCart className="h-4 w-4 mr-2" />
					Add to Cart
				</Button>
			</CardFooter>
		</Card>
	)
}
