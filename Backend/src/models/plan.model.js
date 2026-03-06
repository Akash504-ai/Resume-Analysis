import mongoose from "mongoose";

/* -----------------------------
   TASK SCHEMA
------------------------------ */
const taskSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true
    },

    completed: {
      type: Boolean,
      default: false
    },

    // Stores the exact time when task was completed
    completedAt: {
      type: Date,
      default: null
    }
  },
  { _id: false }
);


/* -----------------------------
   DAY SCHEMA
------------------------------ */
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


/* -----------------------------
   PLAN SCHEMA
------------------------------ */
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


/* -----------------------------
   MODEL
------------------------------ */
const planModel = mongoose.model("plans", planSchema);

export default planModel;