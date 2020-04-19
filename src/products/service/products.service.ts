import { Injectable, Logger } from '@nestjs/common';
import { ProductDto } from '../dto/product.dto';
import { MockProducts } from '../repository/products.mock';

@Injectable()
export class ProductsService {

    private readonly logger = new Logger(ProductsService.name);
    private productsQuantity: number;
    private maxDiscount: number;

    constructor() {
        this.productsQuantity = 10; // Quantity for auto-generated products
        this.maxDiscount = 20;
    }

    async getProducts(): Promise<Array<ProductDto>> {
        // return this.buildProducts(this.productsQuantity, 1); // Auto-generated products
        return this.getMockProducts(); // Products from static mocks
    }

    async getProductsByCatalog(catalogId: number): Promise<Array<ProductDto>> {
        // return this.buildProducts(this.productsQuantity, catalogId); // Auto-generated products
        return this.getMockProducts().filter((e) => {
            e.catalogId === catalogId;
        }); // Products from static mocks
    }

    /**
     * Get the offer for received products
     * @param reqProducts 
     */
    async getOfferProducts(reqProducts: Array<any>): Promise<any> {
        this.logger.log(`Getting ${reqProducts.length} offer Products`);
        let offerProducts = [];
        const products = await this.getProducts();        
        for (const reqProd of reqProducts) {            
            let product = products.find((e) => {                
                return e.id === reqProd;
            });
            
            if(product) {
                let offerProduct = { productId: reqProd, price: product.price, offerPrice: null, discount: 0 };
                let discount = Math.floor(Math.random() * this.maxDiscount) + 1;                
                offerProduct.offerPrice = (product.price * (100 - discount)) / 100;
                offerProduct.discount = discount;                
                offerProducts.push(offerProduct);
            }
        }
        // TODO: Enviar petición al API del backend que recibe el resultado de las ofertas
        return offerProducts;
    }

    /**
     * Get products from static mocks
     */
    getMockProducts() : Array<ProductDto> {
        let products: Array<ProductDto> = [];
        for(const mockProduct of MockProducts.getMockProducts()) {
            let product = new ProductDto();
            product.id = mockProduct.id;
            product.catalogId = mockProduct.categoryId;
            product.price = mockProduct.price;
            product.name = mockProduct.name;
            product.description = mockProduct.description;
            product.imageUrl = mockProduct.imageUrl;
            product.createDate = mockProduct.createDate;            
            products.push(product);
        }
        return products;
    }


    /**
     * Builds dynamically a list of products
     * @param quantity
     * @param categoryId 
     */
    private buildProducts(quantity: number, catalogId: number): Array<ProductDto> {
        let products: Array<ProductDto> = [];
        let i = 1;
        while (i < quantity) {
            let product = new ProductDto();
            product.id = i;
            product.catalogId = catalogId;
            product.price = 50000;
            product.name = `Product ${product.id}`;
            product.description = `${product.name} description`;
            product.imageUrl = `https://www.psdmockups.com/wp-content/uploads/2017/08/Square-Corrugated-Cardboard-Shipping-Box-PSD-Mockup-520x392.jpg`;
            product.createDate = Date.now();            
            products.push(product);
            i ++;
        }
        return products;
    }
}
