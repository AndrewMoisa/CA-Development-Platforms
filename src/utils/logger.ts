import { createLogger, format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const isDev = process.env.NODE_ENV !== "production";

export const logger = createLogger({
  level: isDev ? "debug" : "info",
  format: format.combine(
    format.timestamp(),
    isDev
      ? format.colorize()
      : format.uncolorize(),
    format.errors({ stack: true }),
    format.printf(({ timestamp, level, message, stack }) => {
      return `${timestamp} [${level}]: ${stack || message}`;
    })
  ),
  transports: [
    // Console logs
    new transports.Console(),

    // Daily rotated logs
    new DailyRotateFile({
      dirname: "logs",
      filename: "app-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      level: "info",
      maxSize: "10m",
      maxFiles: "14d",
    }),

    new DailyRotateFile({
      dirname: "logs",
      filename: "error-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      level: "error",
      maxSize: "10m",
      maxFiles: "30d",
    }),
  ],
});