import { IsNotEmpty } from 'class-validator';

export class ProductDto {
    @IsNotEmpty()
    id: number;
    @IsNotEmpty()
    name: string;
    @IsNotEmpty()
    description: string;
    imageUrl: string;
    price: number;
    @IsNotEmpty()
    catalogId: number;
    @IsNotEmpty()
    createDate: number;
}
