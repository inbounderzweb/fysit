import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";
import { contentLifecycleFields, seoSchema } from "@/models/shared";

const serviceSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    shortDescription: { type: String, trim: true },
    description: { type: String, required: true },
    features: { type: [String], default: [] },
    image: { type: String, trim: true },
    seo: { type: seoSchema, default: () => ({}) },
    ...contentLifecycleFields,
  },
  { timestamps: true }
);

serviceSchema.index({ status: 1, publishedAt: -1 });

export type ServiceDocument = InferSchemaType<typeof serviceSchema>;

export const Service: Model<ServiceDocument> =
  models.Service ?? model<ServiceDocument>("Service", serviceSchema);
