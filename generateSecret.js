import crypto from "crypto";

const generateSecret = () => {
  const secret = crypto.randomBytes(64).toString("hex");
  console.log("Generated ACCESS_TOKEN_SECRET: ", secret);
};

generateSecret();
