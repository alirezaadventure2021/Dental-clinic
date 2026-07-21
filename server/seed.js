const bcrypt = require('bcryptjs');
const sequelize = require('./config/database');
const User = require('./models/User');

const seed = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected.');

    await sequelize.sync({ alter: true });
    console.log('Models synchronized.');

    const existingUser = await User.findOne({ where: { email: 'mahmoodalizada@gmail.com' } });
    if (existingUser) {
      console.log('Admin user already exists.');
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash('1234', 10);

    await User.create({
      name: 'mahmood',
      email: 'mahmoodalizada@gmail.com',
      password: hashedPassword,
      role: 'admin',
    });

    console.log('Admin user created successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seed();
