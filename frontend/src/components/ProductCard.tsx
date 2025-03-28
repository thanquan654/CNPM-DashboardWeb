import {
	Card,
	CardContent,
	CardDescription,
	CardTitle,
} from '@/components/ui/card'
import { Prediction } from '@/pages/RecommendationsPage'

interface ProductCardProps {
	product: Prediction
}

export function ProductCard({ product }: ProductCardProps) {
	return (
		<Card className="overflow-hidden">
			<CardContent className="">
				<div className="flex justify-between items-start">
					<div>
						<CardTitle className="text-lg">
							{product.Item}
						</CardTitle>
						<CardDescription className="line-clamp-2">
							<span className="text-sm text-gray-400">
								Color:{' '}
							</span>
							{product.Color}
						</CardDescription>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}
