export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    uri: process.env.DATABASE_URI || 'mongodb://localhost/nest',
  },
  jwtSecret: process.env.JWT_SECRET || 'secretKey',
  jwtPublic: process.env.JWT_PUBLIC || 'jwtPublic',
  MONGO_URI: process.env.MONGO_URI
});