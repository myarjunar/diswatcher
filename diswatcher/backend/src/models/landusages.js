module.exports = (sequelize, DataTypes) => {
  const Landusages = sequelize.define(
    'osm_landusages',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      z_order: { type: DataTypes.INTEGER },
      osm_id: { type: DataTypes.INTEGER },
      changeset_id: { type: DataTypes.INTEGER },
      changeset_version: { type: DataTypes.INTEGER },
      changeset_timestamp: { type: DataTypes.DATE },
      changeset_user: { type: DataTypes.STRING },
      name: { type: DataTypes.STRING },
      type: { type: DataTypes.STRING },
      area: { type: DataTypes.NUMBER },
      geometry: { type: DataTypes.GEOMETRY },
    },
    { timestamps: false }
  );

  return Landusages;
};
