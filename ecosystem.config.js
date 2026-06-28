module.exports = {
  apps: [
    {
      name: "student-nir-edu",
      cwd: "/home/nir/public_html/student.nir-edu.com",
      script: "./node_modules/next/dist/bin/next",
      args: "start -H 127.0.0.1 -p 3005",
      exec_mode: "cluster",
      instances: 4,
      autorestart: true,
      max_memory_restart: "900M",
      exp_backoff_restart_delay: 3000,
      env: {
        NODE_ENV: "production",
        PORT: "3005",
        NEXT_TELEMETRY_DISABLED: "1"
      }
    }
  ]
}