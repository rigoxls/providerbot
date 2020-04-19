import { HttpService, Injectable, Logger } from '@nestjs/common';
import { ProductDto } from '../dto/product.dto';
import { MockProducts } from '../repository/products.mock';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger(ProductsService.name);
  private productsQuantity: number;
  private maxDiscount: number;

  constructor(private http: HttpService) {
    this.productsQuantity = 10; // Quantity for auto-generated products
    this.maxDiscount = 20;
  }

  async getProducts(): Promise<Array<ProductDto>> {
    return this.getMockProducts(); // Products from static mocks
  }

  /**
   * Get the offer for received products
   * @param reqProducts
   */
  async getOfferProducts(reqProducts: Array<any>): Promise<any> {
    this.logger.log(`Cotización resibida`);
    this.logger.log(`${JSON.stringify(reqProducts)}`);
    const offerProducts = [];
    for (const product of reqProducts['products']) {
      if (product) {
        const discount = Math.floor(Math.random() * this.maxDiscount) + 1;
        product.priceOffer = (product.price * (100 - discount)) / 100;
        delete product.price;
        offerProducts.push(product);
      }
    }

    const payload = {
      userId: 2,
      requestId: reqProducts['requestId'],
      status: "PENDING",
      products: offerProducts
    }

    this.logger.log(`Cotización expuesta`);
    this.logger.log(`${JSON.stringify(payload)}`);

    await this.http.post<any>(`http://localhost:3001/offer`, payload).subscribe(data => {
        this.logger.log('Se ha enviado la oferta al cliente emisor');
      },
      error => {
        this.logger.log(JSON.stringify(error));
      });

    return payload;
  }

  /**
   * Get products from static mocks
   */
  async getMockProducts(): Promise<Array<ProductDto>> {
    const products: Array<ProductDto> = [];
    const mockProducts = await this.http.get<any>(`http://demo9871246.mockable.io/provider1`).toPromise();

    for (const mockProduct of mockProducts.data) {
      const product = new ProductDto();
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
}
