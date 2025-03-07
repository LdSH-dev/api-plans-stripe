#!/bin/sh

until nc -z -v -w30 db 5432
  do
    echo "Waiting for the database to start..."
    sleep 5
  done

echo "Running Prisma migrations..."
npx prisma generate
npx prisma migrate deploy

npm run start