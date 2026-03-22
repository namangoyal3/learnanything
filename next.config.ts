import path from "path";
import type { NextConfig } from "next";

/**
 * Pin tracing to this app root so Vercel/CI never infer a parent lockfile folder
 * as the workspace root (breaks "Collecting build traces" / serverless output).
 */
const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(process.cwd()),
};

export default nextConfig;
