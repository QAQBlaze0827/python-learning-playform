# 1. 使用 Node.js 的官方環境
FROM node:22-slim

# 2. 設定容器內的工作目錄
WORKDIR /app

# 3. 先複製 package.json 進去安裝套件 (利用 Docker 快取機制加速)
COPY package*.json ./
RUN npm install

# 4. 複製剩下的所有程式碼進去
COPY . .

# 5. 告訴 Docker 這個容器會用 3000 port
EXPOSE 3000

# 6. 設定環境變數，讓 Nuxt 可以在外部被存取
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

# 7. 啟動指令 (開發模式)
CMD ["npm", "run", "dev"]