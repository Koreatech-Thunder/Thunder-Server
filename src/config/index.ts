import dotenv from "dotenv";

// Set the NODE_ENV to 'development' by default
//process.env.NODE_ENV = process.env.NODE_ENV || "development";

const envFound = dotenv.config();
if (envFound.error) {
  // This error should crash whole process

  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

export default {
  /**
   * environment
   */
  env: process.env.NODE_ENV as string,

  /**
   * Your favorite port
   */
  port: parseInt(process.env.PORT as string, 10) as number,

  /**
   * MongoDB URI
   */
  mongoURI: process.env.MONGODB_URI as string,

  /**
   * JWT Secret Key
   */ 

  jwtSecret: process.env.JWT_SECRET as string,



};
