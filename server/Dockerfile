# Node.js 기반 이미지
FROM node:24.4.0

# 작업 디렉토리 설정
WORKDIR /app

# package.json과 package-lock.json만 먼저 복사 (캐시 활용)
COPY package*.json ./

# 의존성 설치
RUN npm install

# 앱 전체 복사
COPY . .

# 포트 오픈
EXPOSE 5000

# 앱 실행
CMD ["npx", "nodemon"]