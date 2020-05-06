import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfiguration } from 'config/database.configuration';
import { Administrator } from 'entities/administrator.entity';
import { AdministratorService } from './services/administrator/administrator.service';
import { FurniturePrice } from 'entities/furniture-price.entity';
import { Furniture } from 'entities/furniture.entity';
import { Category } from 'entities/category.entity';
import { Photo } from 'entities/photo.entity';
import { ApiAdministratorController } from './controllers/api.administrator.controller';
import { ApiCategoryController } from './controllers/api.category.controller';
import { CategoryService } from './services/category/category.service';
import { FurnitureService } from './services/furniture/furniture.service';
import { ApiFurnitureController } from './controllers/api.furniture.controller';
import { Store } from 'entities/store.entity';
import { Availability } from 'entities/availability.entity';
import { StoreService } from './services/store/store.service';
import { ApiStoreController } from './controllers/api.store.controller';
import { AuthController } from './controllers/auth.controller';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { PhotoService } from './services/photo/photo.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mariadb', // Ako koristite MySQL, napisite mysql
      host: DatabaseConfiguration.hostname,
      port: 3306,
      username: DatabaseConfiguration.username,
      password: DatabaseConfiguration.password,
      database: DatabaseConfiguration.database,
      entities: [
        Administrator,
        FurniturePrice,
        Furniture,
        Category,
        Photo,
        Store,
        Availability
      ]
    }),
    TypeOrmModule.forFeature([
      Administrator,
      FurniturePrice,
      Furniture,
      Category,
      Photo,
      Store,
      Availability
    ])
  ],
  controllers: [
    AppController,
    ApiAdministratorController,
    ApiCategoryController,
    ApiFurnitureController,
    ApiStoreController,
    AuthController,
  ],
  providers: [
    AdministratorService,
    CategoryService,
    FurnitureService,
    StoreService,
    PhotoService
  ],
  exports: [
    AdministratorService
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude('auth/*')
      .forRoutes('api/*');
  }
    
}
