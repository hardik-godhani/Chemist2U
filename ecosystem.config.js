module.exports = {
  apps: [{
    name: 'chemist2u-api',
    script: './dist/apps/backend/main.js',
    cwd: '/home/appuser/apps/chemist2u',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      HOST: '0.0.0.0',
      CORS_ORIGIN: 'http://your-domain.com', // Update with your actual domain or IP
      RATE_LIMIT_MAX: 100,
      RATE_LIMIT_WINDOW: 60000
    },
    error_file: './logs/api-err.log',
    out_file: './logs/api-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    watch: false,
    max_memory_restart: '500M',
    min_uptime: '10s',
    max_restarts: 10,
    restart_delay: 4000
  }]
};
