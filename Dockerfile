# Etapa 1: build da aplicação
FROM node:20.11-alpine AS build

WORKDIR /app

# Copia os arquivos necessários para instalar dependências
COPY package.json yarn.lock ./

# Instala dependências sem dev
RUN yarn install --frozen-lockfile

# Copia todo o código fonte
COPY . .

# Compila o projeto
RUN yarn build

# Etapa 2: imagem final para produção
FROM node:20.11-alpine


WORKDIR /app

# Copia apenas os artefatos necessários
COPY --from=build /app/package.json ./
COPY --from=build /app/yarn.lock ./
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules

EXPOSE 3000

CMD ["node", "dist/src/main"]
