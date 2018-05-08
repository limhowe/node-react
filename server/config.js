import dotenv from 'dotenv';

// initializing env variables
try {
  dotenv.config();  // eslint-disable-line
}
catch (e) {
  console.log('Could not find .env file. Continuing..'); // eslint-disable-line
}

export default {
    mongoURL: process.env.MONGO_URL,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpires: '30d',
    EMAIL_API_TOKEN: process.env.EMAIL_API_TOKEN,
    SENDER_EMAIL: process.env.SENDER_EMAIL
};
