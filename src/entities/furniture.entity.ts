import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable
} from "typeorm";
import { Category } from "./category.entity";
import { FurniturePrice } from "./furniture-price.entity";
// import { Availability } from "./availability.entity";
import { Photo } from "./photo.entity";
import { FurnitureFeature } from "./furniture-feature.entity";
import { Feature } from "./feature.entity";
import { from } from "rxjs";
// import { Store } from "./store.entity";
import * as Validator from 'class-validator'
import { FurnitureStatus } from "src/types/furniture.status.enum";

@Entity()
export class Furniture {
  @PrimaryGeneratedColumn({ type: "int", name: "furniture_id", unsigned: true })
  furnitureId: number;

  @Column({ type: "varchar", length: 128 })
  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.Length(3,128)
  name: string;

  @Column({ type: "int", name: "category_id", unsigned: true })
  categoryId: number;

  @Column({ type: "text" })
  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.Length(64, 10000)
  description: string;
  
  @Column({
    type: "enum",
    enum: ["available", "visible", "hidden"],
    default: () => "'available'",
  })
  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.IsEnum(FurnitureStatus)
  status: "available" | "visible" | "hidden";

  
  @Column({
    type: "tinyint",
    name: "available_one",
    unsigned: true
  })
  @Validator.IsNotEmpty()
  @Validator.IsIn([0, 1])
  availableOne: number;


  
  @Column({
    type: "tinyint",
    name: "available_two",
    unsigned: true
  })
  @Validator.IsNotEmpty()
  @Validator.IsIn([0, 1])
  availableTwo: number;
  // @OneToMany(() => Availability, (availability) => availability.furniture)
  // availabilities: Availability[];

  // @ManyToMany(type => Store, store => store.furnitures)
  // @JoinTable({
  //   name: "availability",
  //   joinColumn: {name: "furniture_id", referencedColumnName:"furnitureId"},
  //   inverseJoinColumn: {name: "store_id", referencedColumnName:"storeId"}
  // })
  // stores: Store[];

  @ManyToOne(() => Category, (category) => category.furnitures, {
    onDelete: "NO ACTION",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "category_id", referencedColumnName: "categoryId" }])
  category: Category;

  @OneToMany(() => FurniturePrice, (furniturePrice) => furniturePrice.furniture)
  furniturePrices: FurniturePrice[];

  @OneToMany(() => Photo, (photo) => photo.furniture)
  photos: Photo[];

  @OneToMany(
    () => FurnitureFeature,
    furnitureFeature => furnitureFeature.furniture
  )
  furnitureFeatures: FurnitureFeature[];

  @ManyToMany(type => Feature, feature => feature.furnitures)
  @JoinTable({
    name: "furniture_feature",
    joinColumn: { name: "furniture_id", referencedColumnName: "furnitureId" },
    inverseJoinColumn: { name: "feature_id", referencedColumnName: "featureId" }
  })
  features: Feature[];
}
