import type cors from "cors";

const allowedOrigin = ["http://localhost:4000"];

const options: cors.CorsOptions = {
  origin: allowedOrigin,
};

export default options;
