const express = require("express");
const app = express();
const nunjucks = require("nunjucks");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const REST_API_KEY = "f82e9af37dd14e0bd5640c66dbb554c8";
const KAKAO_REDIRECT_URI = `http://localhost:7700/auth/kakao/callback`;

app.set("view engine", "html");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
nunjucks.configure("views", {
    express: app,
});
app.use(cookieParser());

app.get("/", authenticateJWT, (req, res, next) => {
    try {
        // console.log(req);
        res.render("index", { user: req.user });
    } catch (e) {
        next(e);
    }
});

app.get("/auth/kakao/login", (req, res, next) => {
    try {
        const redirectURI = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code`;
        res.redirect(redirectURI);
    } catch (e) {
        next(e);
    }
});

// function authenticateJWT(req, res, next) {
//     const token = req.cookies.jwt;
//     if (token) {
//         jwt.verify(token, "seon", (err, user) => {
//             if (err) {
//                 return res.sendStatus(403);
//             }
//             req.user = user;
//             next();
//         });
//     } else {
//         res.sendStatus(401);
//     }
// }

function authenticateJWT(req, res, next) {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, "seon", (err, user) => {
            if (err) {
                req.user = null;
            } else {
                req.user = user;
            }
            next();
        });
    } else {
        req.user = null;
        next();
    }
}

// 쿠키날리면 Unauthorized 뜨므로 익명 사용자 처리해야 한다.

app.get("/auth/kakao/callback", async (req, res, next) => {
    try {
        const { code } = req.query;
        const host = "https://kauth.kakao.com/oauth/token";
        // Content-type: application/x-www-form-urlencoded;charset=utf-8
        const body = `grant_type=authorization_code&client_id=${REST_API_KEY}&redirect_uri=${KAKAO_REDIRECT_URI}&code=${code}`;
        const response = await axios.post(host, body, {
            headers: {
                "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
            },
        });

        // console.log(response);
        const {
            data: { access_token },
        } = response;

        const userinfo = await axios.get("https://kapi.kakao.com/v2/user/me", {
            headers: { Authorization: `Bearer ${access_token}` },
        });
        // console.log(userinfo);
        // 필요한 항목만 뽑아서
        // 우리 백엔드서버에 요청. 백엔드는 그 userinfo에 대해서 확인 및 조회를 하고 프론트에다가 토큰 전달
        // 프론트는 클라이언트에게 토큰을 쿠키로 전달
        // 쿠키가 있을 때의 메인화면과, 쿠키가 없을 때의 메인화면의 응답 페이지로 이동
        // 쿠키가 있을 때 사용자 닉네임과 프로필

        // 오늘 내일로 프로세스 고고한다.
        // 그 결과물로 다음팀플 팀원 선정함.

        const userId = userinfo.data.id;
        console.log("User ID: ", userId);

        const nickname = userinfo.data.properties.nickname;
        console.log("Nickname: ", nickname);

        const backendResponse = await axios.post(
            "http://localhost:8000/user/login",
            { userId, nickname },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        const token = backendResponse.data.token;
        console.log(token);
        res.cookie("jwt", token, {
            domain: "localhost",
            path: "/",
            maxAge: 60 * 60 * 1000,
            // 1시간동안 유효한 쿠키
        });

        res.redirect("/");
    } catch (e) {
        console.log(e.message);
        next(e);
    }
});

app.use((error, req, res, next) => {
    if (res.headersSent) {
        return next(error);
    }
    res.status(500).send(error.message);
});

app.listen(7700, () => {
    console.log("server start");
});
