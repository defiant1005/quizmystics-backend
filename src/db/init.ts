import { sequelize } from './sequelize.js';
import { tableRelationship } from './table-relationships.js';

export const initDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Подключение к БД успешно');

    tableRelationship();

    await sequelize.sync({ alter: true });

    console.log('✅ Таблицы синхронизированы');
  } catch (error) {
    console.error('❌ Ошибка при инициализации БД:', error);
  }
};
