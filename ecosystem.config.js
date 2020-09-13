module.exports = {
  apps: [
    {
      name: 'real-uno-server',
      script: './bin/www',
      cwd: './',
      instances: 1,
      merge_logs: true,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development',
        PORT: 9013,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 9013,
      },
    },
  ],
};
