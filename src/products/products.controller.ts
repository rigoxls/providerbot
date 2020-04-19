import { Controller, Get, Param, ParseIntPipe, Logger } from '@nestjs/common';
import { ProductDto } from './dto/product.dto';
import { ProductsService } from './service/products.service';
import { MessagePattern, RmqContext, Ctx, Payload } from '@nestjs/microservices';
const xmlbuilder = require('xmlbuilder');

@Controller('products')
export class ProductsController {
    private readonly logger = new Logger(ProductsService.name);

    constructor(private productsService: ProductsService) {
    }

    @Get('/')
    async getProducts(): Promise<any> {        
        const products = await this.productsService.getProducts();
        if (process.env.format === 'xml') {
            let xml = xmlbuilder.create('Products');
            for (const product of products) {
                xml.ele('Product', product)
            }
            return xml.end({pretty: true});
        }
        else {
            return products
        }
    }

    @Get('/byCatalog:catalogId')
    getProductsByCategory(@Param('catalogId', ParseIntPipe) catalogId: number): Promise<Array<ProductDto>> {
        return this.productsService.getProductsByCatalog(catalogId);
    }

    @MessagePattern('rabbit-mq-producer')
    public async execute(
        @Payload() data: any        
    ) {
        try {                        
            const offer = data;
            this.productsService.getOfferProducts(offer.products);                        
        } catch (error) {
            this.logger.error(error.message);
            
        }
    }

}
