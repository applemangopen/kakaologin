# 간편로그인

잡코리아 -> 간편로그인 -> [카카오 로그인] -> 카카오아이디, 카카오패스워드 확인 -> 로그인 짜잔~!

`OAuth 2.0` 프로토콜
`인증`

# Kakao Login

`OAuth 2.0` 먼저 검색
`kakao developers`

https://baekspace.tistory.com/117

# 인가코드받기

```js
const REST_API_KEY = "f82e9af37dd14e0bd5640c66dbb554c8";
const KAKAO_REDIRECT_URI = `http://localhost:3000/auth/kakao/callback`;
const redirectURI = `https://kauto.kakao.com/oauth/authorize?client_id=${REST_API_KEY}$redirect_uri=${KAKAO_REDIRECT_URI}&response_type=값``
```

## 요청 헤더

```

GET / HTTP/1.1
asdf:asdf
asdf:asdf
Authorization:Bearer [JWT Token]
```
