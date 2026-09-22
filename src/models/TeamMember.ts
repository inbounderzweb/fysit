import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";
import { CONTENT_STATUSES } from "@/lib/constants";

const teamMemberSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, trim: true },
    bio: { type: String, trim: true },
    photo: { type: String, trim: true },
    socialLinks: {
      type: Map,
      of: String,
      default: undefined,
    },
    order: { type: Number, default: 0 },
    status: { type: String, enum: CONTENT_STATUSES, required: true, default: "DRAFT" },
  },
  { timestamps: true }
);

teamMemberSchema.index({ status: 1, order: 1 });

export type TeamMemberDocument = InferSchemaType<typeof teamMemberSchema>;

export const TeamMember: Model<TeamMemberDocument> =
  models.TeamMember ?? model<TeamMemberDocument>("TeamMember", teamMemberSchema);
