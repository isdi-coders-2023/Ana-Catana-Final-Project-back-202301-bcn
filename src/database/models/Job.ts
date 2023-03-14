import { Schema, model } from "mongoose";

const jobSchema = new Schema({
  jobTitle: {
    type: String,
    required: true,
  },

  companyName: {
    type: String,
    required: true,
  },

  salary: {
    type: Number,
    required: true,
  },

  url: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  image: {
    type: String,
    required: true,
  },
});

const Jobs = model("Jobs", jobSchema, "jobs");
export default Jobs;
