import { getMissingEnvVars, parsedEnv } from "./parsedEnv";

interface LokiConfig {
  name: string;
  url: string;
  user: string;
  password: string;
  env: string;
}

class LokiService {
  private enabled: boolean;
  private name: string;
  private url: string;
  private env: string;
  private authHeader: string;

  constructor(config?: LokiConfig) {
    this.enabled = Boolean(config);
    this.name = config?.name || "";
    this.url = config?.url || "";
    this.env = config?.env || "";
    this.authHeader = config ? `Basic ${Buffer.from(`${config.user}:${config.password}`).toString("base64")}` : "";
  }

  async sendLog(event_name: string, body: Record<string, unknown>): Promise<void> {
    if (!this.enabled) {
      return;
    }

    const timestamp = Date.now() * 1_000_000;

    const payload = {
      streams: [
        {
          stream: {
            event: event_name,
            app: this.name,
            env: this.env,
          },
          values: [[timestamp.toString(), JSON.stringify(body)]],
        },
      ],
    };

    try {
      const response = await fetch(`${this.url}/loki/api/v1/push`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: this.authHeader,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error("Failed to send log to Loki", response.status, errorBody);
      }
    } catch (error) {
      console.error("Network error while sending log to Loki", error);
    }
  }
}

const missingLokiEnv = getMissingEnvVars(["LOKI_NAME", "LOKI_URL", "LOKI_USER", "LOKI_TOKEN", "LOKI_ENV"]);

export const lokiService =
  missingLokiEnv.length === 0
    ? new LokiService({
        name: parsedEnv.LOKI_NAME,
        url: parsedEnv.LOKI_URL,
        user: parsedEnv.LOKI_USER,
        password: parsedEnv.LOKI_TOKEN,
        env: parsedEnv.LOKI_ENV,
      })
    : new LokiService();
