const express = require("express");
const userRoutes = require("./src/user/user.router");
const { sequelize } = require("./src/entity");

const app = express();
app.use(express.json());

app.use("/user", userRoutes);

sequelize
    .sync({ force: true }) // 주의: 'force: true'는 개발 환경에서만 사용하세요. 이 옵션은 기존 테이블을 삭제합니다.
    .then(() => {
        console.log("Database & tables created!");
        // 데이터베이스 동기화 후 서버 시작
        app.listen(8000, () => {
            console.log("Backend server start");
        });
    })
    .catch((error) => {
        console.error("Error syncing database:", error);
    });
