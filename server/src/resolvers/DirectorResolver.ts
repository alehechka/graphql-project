import {
	Arg,
	Field,
	FieldResolver,
	InputType,
	Int,
	Mutation,
	Query,
	Resolver,
	Root,
	UseMiddleware,
} from 'type-graphql';
import { Director, Movie } from '../entities';
import { isAuth } from '../middleware';

@InputType()
class DirectorUpdateInput {
	@Field(() => String, { nullable: true })
	firstName?: string;

	@Field(() => String, { nullable: true })
	lastName?: string;

	@Field(() => Int, { nullable: true })
	age?: number;
}

@InputType()
class DirectorCreateInput {
	@Field()
	firstName: string;

	@Field()
	lastName: string;

	@Field(() => Int)
	age: number;
}

@InputType()
class DirectorQueryInput extends DirectorUpdateInput {
	@Field(() => String, { nullable: true })
	id?: string;
}

@Resolver(() => Director)
export class DirectorResolver {
	@Mutation(() => Director)
	@UseMiddleware(isAuth)
	async createDirector(
		@Arg('input', () => DirectorCreateInput)
		options: DirectorCreateInput
	) {
		const director = await Director.create(options).save();
		return director;
	}

	@Mutation(() => Boolean)
	@UseMiddleware(isAuth)
	async updateDirector(
		@Arg('id') id: string,
		@Arg('input', () => DirectorUpdateInput) input: DirectorUpdateInput
	) {
		await Director.update({ id }, input);
		return true;
	}

	@Mutation(() => Boolean)
	@UseMiddleware(isAuth)
	async deleteDirector(@Arg('id') id: string) {
		await Director.delete({ id });
		return true;
	}

	@Query(() => [Director])
	@UseMiddleware(isAuth)
	async directors(@Arg('options', () => DirectorQueryInput, { nullable: true }) options: DirectorQueryInput) {
		return await Director.find(options);
	}

	@Query(() => Director, { nullable: true })
	@UseMiddleware(isAuth)
	async director(@Arg('id', () => String) id: string) {
		return await Director.findOne({ id });
	}

	@FieldResolver()
	async movies(@Root() director: Director) {
		return await Movie.find({ directorId: director.id });
	}
}
