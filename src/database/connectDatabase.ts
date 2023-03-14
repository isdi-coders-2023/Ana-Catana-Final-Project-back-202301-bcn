import mongoose from "mongoose";
import createDebug from "debug";

const debug = createDebug("jobtrail:database");

const connectDatabase = async (url: string) => {
  mongoose.set("strictQuery", false);
  mongoose.set("debug", true);
  mongoose.set("toJSON", {
    virtuals: true,
    transform(doc, ret) {
      delete ret._id;
      delete ret.__v;
    },
  });

  try {
    await mongoose.connect(url);

    debug("Connected to database");
  } catch (error) {
    debug(error);
  }
};

export default connectDatabase;
