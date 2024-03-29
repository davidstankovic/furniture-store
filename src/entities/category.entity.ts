import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Index,
} from "typeorm";
import { Furniture } from "./furniture.entity";
import * as Validator from 'class-validator';
import { Feature } from "./feature.entity";

@Index("fk_category_parent__category_id", ["parentCategoryId"], {})
@Index("uq_category_image_path", ["imagePath"], { unique: true })
@Index("uq_category_name", ["name"], { unique: true })
@Entity("category")
export class Category {
  @PrimaryGeneratedColumn({ type: "int", name: "category_id", unsigned: true })
  categoryId: number;

  @Column({
    type: "varchar",
    unique: true,
    length: 32,
  })
  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.Length(5,32)
  name: string;

  @Column({
    type: "varchar",
    name: "image_path",
    unique: true,
    length: 128,
  })
  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.Length(1,128)
  imagePath: string;

  @Column({
    type: "int",
    name: "parent__category_id",
    nullable: true,
    unsigned: true
  })
  parentCategoryId: number | null;

  @OneToMany(() => Furniture, (furniture) => furniture.category)
  furnitures: Furniture[];

  @ManyToOne(
    () => Category,
    category => category.categories,
    { onDelete: "NO ACTION", onUpdate: "CASCADE" }
  )
  @JoinColumn([
    { name: "parent__category_id", referencedColumnName: "categoryId" }
  ])
  parentCategory: Category;
  @OneToMany(
    () => Category,
    category => category.parentCategory
  )
  categories: Category[];

  @OneToMany(
    () => Feature,
    feature => feature.category
  )
  features: Feature[];
}
