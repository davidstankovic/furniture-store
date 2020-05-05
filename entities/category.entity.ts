import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Furniture } from "./furniture.entity";

@Entity()
export class Category {
  @PrimaryGeneratedColumn({ type: "int", name: "category_id", unsigned: true })
  categoryId: number;

  @Column({
    type: "varchar",
    unique: true,
    length: 32,
  })
  name: string;

  @Column({
    type: "varchar",
    name: "image_path",
    unique: true,
    length: 128,
  })
  imagePath: string;

  @Column({
    type: "int",
    name: "parent__category_id",
    nullable: true,
    unsigned: true,
  })
  parentCategoryId: number | null;

  @OneToMany(() => Furniture, (furniture) => furniture.category)
  furnitures: Furniture[];

  @ManyToOne(() => Category, (category) => category.categories, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([
    { name: "parent__category_id", referencedColumnName: "categoryId" },
  ])
  parentCategory: Category;

  @OneToMany(() => Category, (category) => category.parentCategory)
  categories: Category[];
}
