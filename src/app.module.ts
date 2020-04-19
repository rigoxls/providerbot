import { HttpModule, Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [ProductsModule, HttpModule],
  controllers: []  
})
export class AppModule {}
