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

@Entity()
export class Furniture {
  @PrimaryGeneratedColumn({ type: "int", name: "furniture_id", unsigned: true })
  furnitureId: number;

  @Column({ type: "varchar", length: 128 })
  name: string;

  @Column({ type: "int", name: "category_id", unsigned: true })
  categoryId: number;

  @Column({ type: "text" })
  description: string;

  @Column({
    type: "varchar", 
    name: "construction",
    length: 128
  })
  construction: string;

  @Column({ type: "varchar", name: "color", length: 32 })
  color: string;

  @Column({
    type: "decimal",
    name: "height",
    unsigned: true,
    precision: 10,
    scale: 2
  })
  height: string;

  @Column({
    type: "decimal", 
    name: "width",
    unsigned: true,
    precision: 10,
    scale: 2
  })
  width: string;

  @Column({
    type: "decimal",
    name: "deep",
    unsigned: true,
    precision: 10,
    scale: 2
  })
  deep: string;

  @Column({ type: "varchar", name: "material", length: 32})
  material: string;


  @Column({
    type: "enum",
    enum: ["available", "visible", "hidden"],
    default: () => "'available'",
  })
  status: "available" | "visible" | "hidden";

  @OneToMany(() => Availability, (availability) => availability.furniture)
  availabilities: Availability[];

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
