import { Field, ObjectType } from 'type-graphql';
import { User } from '../entities';
import { FieldError } from './FieldError';

@ObjectType()
export class UserResponse {
	@Field(() => User, { nullable: true })
	user?: User;

	@Field(() => [FieldError], { nullable: true })
	errors?: FieldError[];
}
