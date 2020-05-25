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
import { Availability } from "./availability.entity";
import { Photo } from "./photo.entity";
import { from } from "rxjs";
import { Store } from "./store.entity";
import * as Validator from 'class-validator'
import { ArticleStatus } from "src/types/furniture.status.enum";

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
    type: "varchar", 
    name: "construction",
    length: 128
  })
  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.Length(10,128)
  construction: string;

  @Column({ type: "varchar", name: "color", length: 32 })
  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.Length(3,32)
  color: string;

  @Column({
    type: "decimal",
    name: "height",
    unsigned: true,
    precision: 10,
    scale: 2
  })
  @Validator.IsNotEmpty()
  @Validator.IsPositive()
  @Validator.IsNumber({
    allowInfinity: false,
    allowNaN: false,
    maxDecimalPlaces: 2,
  })
  height: number;

  @Column({
    type: "decimal", 
    name: "width",
    unsigned: true,
    precision: 10,
    scale: 2
  })
  @Validator.IsNotEmpty()
  @Validator.IsPositive()
  @Validator.IsNumber({
    allowInfinity: false,
    allowNaN: false,
    maxDecimalPlaces: 2,
  })
  width: number;

  @Column({
    type: "decimal",
    name: "deep",
    unsigned: true,
    precision: 10,
    scale: 2
  })
  @Validator.IsNotEmpty()
  @Validator.IsPositive()
  @Validator.IsNumber({
    allowInfinity: false,
    allowNaN: false,
    maxDecimalPlaces: 2,
  })
  deep: number;

  @Column({ type: "varchar", name: "material", length: 32})
  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.Length(3,32)
  material: string;
  
  @Column({
    type: "enum",
    enum: ["available", "visible", "hidden"],
    default: () => "'available'",
  })
  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.IsEnum(ArticleStatus)
  status: "available" | "visible" | "hidden";

  @OneToMany(() => Availability, (availability) => availability.furniture)
  availabilities: Availability[];

  @ManyToMany(type => Store, store => store.furnitures)
  @JoinTable({
    name: "availability",
    joinColumn: {name: "furniture_id", referencedColumnName:"furnitureId"},
    inverseJoinColumn: {name: "store_id", referencedColumnName:"storeId"}
  })
  stores: Store[];

  @ManyToOne(() => Category, (category) => category.furnitures, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "category_id", referencedColumnName: "categoryId" }])
  category: Category;

  @OneToMany(() => FurniturePrice, (furniturePrice) => furniturePrice.furniture)
  furniturePrices: FurniturePrice[];

  @OneToMany(() => Photo, (photo) => photo.furniture)
  photos: Photo[];
}
