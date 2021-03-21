module.exports = {
  type: 'postgres',
  host:'localhost',
  port: 5432,
  username: 'postgres',
  password: 'django123',
  database: 'cars',
  synchronize: true,
  logging: true,
  entities: ['dist/**/*.model.{t,j}s'],
  migrations: ['src/**/*.migration.{t,j}s'],
  seeds: ['src/**/*.seed.{t,j}s'],
  factories: ['src/**/*.factory.{t,j}s'],
};
