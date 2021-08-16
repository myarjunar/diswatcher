module.exports = {
  up: async (queryInterface, Sequelize) => {
    const process = await queryInterface.createTable(
      'disasters',
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        event_id: { type: Sequelize.INTEGER },
        external_id: { type: Sequelize.STRING },
        name: { type: Sequelize.STRING },
        description: { type: Sequelize.STRING },
        link: { type: Sequelize.STRING },
        severity: { type: Sequelize.STRING },
        source: { type: Sequelize.STRING },
        type: { type: Sequelize.STRING },
        timestamp: { type: Sequelize.DATE },
        geometry: { type: Sequelize.GEOMETRY },
      },
      { timestamps: false }
    );

    return process;
  },
  down: (queryInterface) => {
    const process = queryInterface.dropTable('batch_disbursements');

    return process;
  },
};
