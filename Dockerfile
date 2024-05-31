# Builder stage --------------------------------------------------------------
FROM node:20.14-alpine AS builder

COPY . /app
WORKDIR /app
# Enable Yarn Berry
RUN corepack enable
RUN yarn install --immutable
RUN yarn build

# Final stage ----------------------------------------------------------------
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
