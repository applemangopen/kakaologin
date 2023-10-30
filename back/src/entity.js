const { Sequelize, DataTypes, Model } = require("sequelize");

const sequelize = new Sequelize("kakao", "seon", "Seon12$$", {
    host: "localhost",
    dialect: "mysql",
});

class User extends Model {}

User.init(
    {
        userId: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        nickname: {
            type: DataTypes.STRING,
        },
    },
    {
        sequelize,
        modelName: "User",
    }
);

sequelize
    .authenticate()
    .then(() => {
        console.log("Database connection has been established successfully.");
    })
    .catch((err) => {
        console.error("Unable to connect to the database:", err);
    });

module.exports = { User, sequelize };
