import { Module, NestModule, MiddlewareConsumer, Get, RequestMethod } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfiguration } from 'config/database.configuration';
import { FurnitureFeature } from 'src/entities/furniture-feature.entity';
import { Feature } from 'src/entities/feature.entity';
import { FeatureService } from './services/feature/feature.service';
import { FeatureController } from './controllers/api.feature.controller';
import { Administrator } from 'src/entities/administrator.entity';
import { AdministratorService } from './services/administrator/administrator.service';
import { FurniturePrice } from 'src/entities/furniture-price.entity';
import { Furniture } from 'src/entities/furniture.entity';
import { Category } from 'src/entities/category.entity';
import { Photo } from 'src/entities/photo.entity';
import { ApiAdministratorController } from './controllers/api.administrator.controller';
import { ApiCategoryController } from './controllers/api.category.controller';
import { CategoryService } from './services/category/category.service';
import { FurnitureService } from './services/furniture/furniture.service';
import { ApiFurnitureController } from './controllers/api.furniture.controller';
import { Store } from 'src/entities/store.entity';
import { Availability } from 'src/entities/availability.entity';
import { StoreService } from './services/store/store.service';
import { ApiStoreController } from './controllers/api.store.controller';
import { AuthController } from './controllers/auth.controller';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { PhotoService } from './services/photo/photo.service';
import { AdministratorToken } from './entities/administrator-token.entity';
import { ApiAvailabilityController } from './controllers/api.availability.controller';
import { AvailabilityService } from './services/availability/availability.service';

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
        FurnitureFeature,
        Feature,
        Furniture,
        Category,
        Photo,
        Store,
        Availability,
        AdministratorToken,
        Availability
      ]
    }),
    TypeOrmModule.forFeature([
      Administrator,
      FurniturePrice,
      FurnitureFeature,
      Feature,
      Furniture,
      Category,
      Photo,
      Store,
      Availability,
      AdministratorToken,
      Availability
    ])
  ],
  controllers: [
    AppController,
    ApiAdministratorController,
    ApiCategoryController,
    FeatureController,
    ApiFurnitureController,
    ApiStoreController,
    AuthController,
    ApiAvailabilityController
  ],
  providers: [
    AdministratorService,
    CategoryService,
    FurnitureService,
    StoreService,
    FeatureService,
    PhotoService,
    AvailabilityService
  ],
  exports: [
    AdministratorService
  ]
})


export class AppModule implements NestModule {
  
  configure(consumer: MiddlewareConsumer) {
    
    consumer
      .apply(AuthMiddleware)
      .exclude('auth/*', {path: 'api/category/', method: RequestMethod.GET} ,{path: 'api/category/(.*)', method: RequestMethod.GET},
                         {path: 'api/furniture/', method: RequestMethod.GET} ,{path: 'api/furniture/(.*)', method: RequestMethod.GET},
                         {path: 'api/furniture/search', method: RequestMethod.POST} ,{path: 'api/furniture/search/(.*)', method: RequestMethod.POST},
                         {path: 'api/feature/', method: RequestMethod.GET} ,{path: 'api/furniture/(.*)', method: RequestMethod.GET},
                         {path: 'api/feature/', method: RequestMethod.POST} ,{path: 'api/furniture/(.*)', method: RequestMethod.POST},
                         {path: 'api/feature/values', method: RequestMethod.GET} ,{path: 'api/feature/values/(.*)', method: RequestMethod.GET},
                         {path: 'api/store/', method: RequestMethod.GET} ,{path: 'api/store/(.*)', method: RequestMethod.GET},)
      .forRoutes('api/*');
  }
}