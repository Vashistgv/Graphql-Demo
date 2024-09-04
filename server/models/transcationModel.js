import mongoose from "mongoose";

const transcationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: {
      type: String,
      require: true,
    },
    paymentType: {
      type: String,
      enum: ["cash", "card"],
      require: true,
    },
    category: {
      type: String,
      enum: ["saving", "expense", "investment"],
      require: true,
    },
    amount: {
      type: Number,
      require: true,
    },
    date: {
      type: String,
      require: true,
    },
    location: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

const Transcation = mongoose.model("Transcation", transcationSchema);

export default Transcation;
