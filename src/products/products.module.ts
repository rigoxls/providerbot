import { HttpModule, Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './service/products.service';

@Module({
  imports: [HttpModule],
  controllers: [ProductsController],
  providers: [ProductsService],

})
export class ProductsModule {
}
