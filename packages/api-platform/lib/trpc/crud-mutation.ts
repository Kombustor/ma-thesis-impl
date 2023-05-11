import { z } from 'zod';

export type MutationSchema<X extends z.ZodRawShape> = z.ZodObject<{
  id?: z.ZodString;
  data: z.ZodObject<X>;
}>;

type ModelWithId<D> = z.ZodObject<{ id: z.ZodOptional<z.ZodString> } & D>;

export const buildCrudSchema = <T extends z.ZodRawShape>(
  model: ModelWithId<T>
) => {
  const modelWithoutId = model.omit({ id: true });

  return {
    id: model.shape.id.unwrap(),
    create: z.object({
      data: modelWithoutId,
    }),
    update: z.object({
      id: model.shape.id.unwrap(),
      data: modelWithoutId.partial(),
    }),
  };
};
