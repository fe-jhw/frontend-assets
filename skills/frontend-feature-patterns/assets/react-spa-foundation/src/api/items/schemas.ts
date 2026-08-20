import { z } from "zod"

import { ApiError, INVALID_API_RESPONSE_MESSAGE } from "@/api-client/api-error"
import type { Item, ItemPage } from "@/api/items/types"

const itemSchema = z.object({
  id: z.string().trim().min(1),
  name: z.string().trim().min(1),
  status: z.enum(["active", "archived"])
}) satisfies z.ZodType<Item>

const itemPageSchema = z.object({
  items: z.array(itemSchema),
  page: z.number().int().positive(),
  size: z.number().int().positive(),
  totalItems: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative()
}) satisfies z.ZodType<ItemPage>

function parseWithSchema<T>(schema: z.ZodType<T>, value: unknown) {
  const result = schema.safeParse(value)
  if (!result.success) {
    throw new ApiError(INVALID_API_RESPONSE_MESSAGE)
  }

  return result.data
}

export const parseItem = (value: unknown) => parseWithSchema(itemSchema, value)
export const parseItemPage = (value: unknown) => parseWithSchema(itemPageSchema, value)
