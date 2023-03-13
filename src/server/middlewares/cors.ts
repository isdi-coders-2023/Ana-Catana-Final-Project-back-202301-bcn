import "../../loadEnviroments.js";
import type cors from "cors";

const allowedOrigin = [
  process.env.LOCAL_SERVER!,
  process.env.LOCAL_CLIENT!,
  process.env.NETLIFY!,
];

const options: cors.CorsOptions = {
  origin: allowedOrigin,
};

export default options;
