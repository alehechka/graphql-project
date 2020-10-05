import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class User extends BaseEntity {
	@Field()
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Field()
	@Column('text', { unique: true })
	email: string;

	@Column()
	password: string;
}
