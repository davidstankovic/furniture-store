import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Furniture } from "./furniture.entity";

@Entity()
export class Photo {
  @PrimaryGeneratedColumn({ type: "int", name: "photo_id", unsigned: true })
  photoId: number;

  @Column({ type: "int", name: "furniture_id", unsigned: true })
  furnitureId: number;

  @Column({
    type: "varchar",
    name: "image_path",
    unique: true,
    length: 128,
  })
  imagePath: string;

  @ManyToOne(() => Furniture, (furniture) => furniture.photos, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "furniture_id", referencedColumnName: "furnitureId" }])
  furniture: Furniture;
}
