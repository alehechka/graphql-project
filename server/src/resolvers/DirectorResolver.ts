import { Arg, Field, InputType, Int, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { Director } from '../entities';
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

	@Field( )
	lastName: string;

	@Field(() => Int)
	age: number;
}

@InputType()
class DirectorQueryInput extends DirectorUpdateInput {
    @Field(() => String, {nullable: true})
    id?: string;
}

@Resolver()
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

	// @Mutation(() => Boolean)
	// @UseMiddleware(isAuth)
	// async updateMovie(@Arg('id') id: string, @Arg('input', () => MovieUpdateInput) input: MovieUpdateInput) {
	// 	await Movie.update({ id }, input);
	// 	return true;
	// }

	// @Mutation(() => Boolean)
	// @UseMiddleware(isAuth)
	// async deleteMovie(@Arg('id') id: string) {
	// 	await Movie.delete({ id });
	// 	return true;
	// }

	@Query(() => [Director])
	@UseMiddleware(isAuth)
	async directors(@Arg('options', () => DirectorQueryInput, { nullable: true }) options: DirectorQueryInput) {
		return await Director.find(options);
	}
}
