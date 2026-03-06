import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true
    },
    completed: {
      type: Boolean,
      default: false
    }
  },
  { _id: false }
);

const daySchema = new mongoose.Schema(
  {
    day: {
      type: Number,
      required: true
    },
    tasks: [taskSchema]
  },
  { _id: false }
);

const planSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true
    },
    days: [daySchema]
  },
  {
    timestamps: true
  }
);

const planModel = mongoose.model("plans", planSchema);

export default  planModel;