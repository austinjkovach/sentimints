# Sentimints

## Database Setup

If you don't have Postgres on your computer run
```
brew install postgres
```
Run npm install
and then run:
```
npm install -g knex
```
Then start your database and run:
```
postgres -D /usr/local/var/postgres
createdb sentimints_dev
knex migrate:latest
knex seed:run
```

## Contributing

Pull the most recent version down to your master:
git pull --rebase origin master

Checkout a new branch for what you're working on:
git checkout -b feat/a-description-here-#[eg]3

ONLY EVER PUSH TO YOUR FEATURE BRANCH, AKA DO NOT PUSH TO MASTER:
git push origin feat/a-description-here-#[eg]3

Submit a pull request on Github from the feature branch to master

Someone who is not you must review and merge

Start the cycle over


pg_upgrade \
  -d /usr/local/var/postgres \
  -D /usr/local/var/postgres9.5 \
  -b /usr/local/Cellar/postgresql/9.4.5/bin/ \
  -B /usr/local/Cellar/postgresql/9.5.1/bin/ \
  -v