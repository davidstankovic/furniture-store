import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Furniture } from "./furniture.entity";
import * as Validator from 'class-validator';

@Entity("furniture_price")
export class FurniturePrice {
  @PrimaryGeneratedColumn({
    type: "int",
    name: "furniture_price_id",
    unsigned: true,
  })
  furniturePriceId: number;

  @Column({ type: "int", name: "furniture_id", unsigned: true })
  furnitureId: number;

  @Column({ type: "decimal", unsigned: true, precision: 10, scale: 2 })
  @Validator.IsNotEmpty()
  @Validator.IsPositive()
  @Validator.IsNumber({
    allowInfinity: false,
    allowNaN: false,
    maxDecimalPlaces: 2,
  })
  price: number;

  @Column({ type: "timestamp", name: "created_at", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @ManyToOne(() => Furniture, (furniture) => furniture.furniturePrices, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "furniture_id", referencedColumnName: "furnitureId" }])
  furniture: Furniture;
}
