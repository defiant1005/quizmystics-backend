import { sequelize } from './sequelize.js';

export const initDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Подключение к БД успешно');

    await sequelize.sync({ alter: true }); // Обновит таблицу, если есть изменения
    console.log('✅ Таблицы синхронизированы');
  } catch (error) {
    console.error('❌ Ошибка при инициализации БД:', error);
  }
};
