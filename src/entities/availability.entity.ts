import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Furniture } from "./furniture.entity";
import { Store } from "./store.entity";
import * as Validator from 'class-validator';

@Index("fk_availability_furniture_id", ["furnitureId"], {})
@Index("fk_availability_store_id", ["storeId"], {})
@Entity("availability")
export class Availability {
  @PrimaryGeneratedColumn({
    type: "int",
    name: "availability_id",
    unsigned: true,
  })
  availabilityId: number;

  @Column({
    type: "tinyint", 
    name: "is_available",
    unsigned: true
  })
  @Validator.IsNotEmpty()
  @Validator.IsIn([0,1])
  isAvailable: number;

  @Column({type: "int", name: "store_id", unsigned: true })
  storeId: number;

  @Column({type: "int",  name: "furniture_id", unsigned: true })
  furnitureId: number;

  @ManyToOne(() => Furniture, (furniture) => furniture.availabilities, {
    onDelete: "NO ACTION",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "furniture_id", referencedColumnName: "furnitureId" }])
  furniture: Furniture;

  @ManyToOne(() => Store, (store) => store.availabilities, {
    onDelete: "NO ACTION",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "store_id", referencedColumnName: "storeId" }])
  store: Store;
}
