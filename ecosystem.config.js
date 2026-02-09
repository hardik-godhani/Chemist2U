module.exports = {
  apps: [{
    name: 'chemist2u-api',
    script: './dist/apps/backend/main.js',
    cwd: '/home/root/apps/chemist2u',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      HOST: '0.0.0.0',
      // CORS_ORIGIN: Configure this in .env file or update below
      // For IP-based access: 'http://YOUR_DROPLET_IP'
      // For domain: 'https://yourdomain.com' (use https when SSL is configured)
      // For multiple origins: separate with commas
      CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://170.64.166.2',
      RATE_LIMIT_MAX: process.env.RATE_LIMIT_MAX || 100,
      RATE_LIMIT_WINDOW: process.env.RATE_LIMIT_WINDOW || 60000,
      // Additional rate limits for specific endpoints
      RATE_LIMIT_EVALUATE: process.env.RATE_LIMIT_EVALUATE || 30,
      RATE_LIMIT_RULES_WRITE: process.env.RATE_LIMIT_RULES_WRITE || 10,
      RATE_LIMIT_RULES_READ: process.env.RATE_LIMIT_RULES_READ || 60
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
    restart_delay: 4000,
    // Graceful shutdown
    kill_timeout: 5000,
    listen_timeout: 3000,
    shutdown_with_message: true,
    // Environment-specific overrides
    env_development: {
      NODE_ENV: 'development',
      CORS_ORIGIN: 'http://localhost:4200'
    },
    env_production: {
      NODE_ENV: 'production',
      // CORS_ORIGIN should be set via .env file in production
    }
  }]
};
