import { Field, Int, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Movie extends BaseEntity {
	@Field()
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Field()
	@Column()
	title: string;

	@Field(() => String, { nullable: true })
	@Column('text', { nullable: true })
	subtitle: string;

	@Field(() => Int)
	@Column('int', { default: 60 })
	minutes: number;

	@Field(() => Int, { nullable: true })
	@Column('int', { nullable: true })
	rating: number;
}
