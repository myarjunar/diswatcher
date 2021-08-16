module.exports = (sequelize, DataTypes) => {
  const Disasters = sequelize.define(
    'disasters',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      event_id: { type: DataTypes.INTEGER },
      external_id: { type: DataTypes.STRING },
      name: { type: DataTypes.STRING },
      description: { type: DataTypes.STRING },
      link: { type: DataTypes.STRING },
      severity: { type: DataTypes.STRING },
      source: { type: DataTypes.STRING },
      type: { type: DataTypes.STRING },
      timestamp: { type: DataTypes.DATE },
      geometry: { type: DataTypes.GEOMETRY },
    },
    { timestamps: false }
  );

  return Disasters;
};
