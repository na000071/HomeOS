import { spawn } from "node:child_process";
import net from "node:net";

const services = [
  {
    name: "frontend",
    port: 5173,
    command: "npm",
    args: ["--prefix", "frontend", "run", "dev", "--", "--host", "localhost", "--port", "5173", "--strictPort"],
  },
  {
    name: "api",
    port: 5050,
    command: "dotnet",
    args: ["run", "--no-launch-profile", "--project", "backend/HomeOS.Api/HomeOS.Api.csproj", "--urls", "http://localhost:5050"],
  },
];

const children = [];
let shuttingDown = false;

const isPortOpen = (port) => new Promise((resolve) => {
  const socket = net.createConnection({ host: "localhost", port });
  socket.once("connect", () => {
    socket.destroy();
    resolve(true);
  });
  socket.once("error", () => resolve(false));
});

const stopChild = (child) => {
  if (!child || child.exitCode !== null) return;

  if (process.platform === "win32") {
    spawn("taskkill", ["/pid", String(child.pid), "/T", "/F"], { stdio: "ignore" });
  } else {
    child.kill("SIGTERM");
  }
};

const stopChildren = () => {
  if (shuttingDown) return;
  shuttingDown = true;
  children.forEach(stopChild);
};

process.once("SIGINT", () => {
  stopChildren();
  process.exit(0);
});
process.once("SIGTERM", () => {
  stopChildren();
  process.exit(0);
});

const start = async () => {
  for (const service of services) {
    if (await isPortOpen(service.port)) {
      console.log(`[${service.name}] already running on port ${service.port}; reusing it`);
      continue;
    }

    const command = process.platform === "win32" && service.command === "npm"
      ? "npm.cmd"
      : service.command;
    const child = spawn(command, service.args, {
      cwd: process.cwd(),
      stdio: "inherit",
    });
    children.push(child);
    console.log(`[${service.name}] starting on port ${service.port}`);

    child.once("exit", (code) => {
      if (shuttingDown) return;
      console.error(`[${service.name}] exited with code ${code ?? 0}`);
      stopChildren();
      process.exit(code ?? 1);
    });
  }

  console.log("HomeOS frontend: http://localhost:5173");
  console.log("HomeOS API health: http://localhost:5050/api/health");
};

void start();
