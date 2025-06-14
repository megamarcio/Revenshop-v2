
/**
 * Simples parse de comandos cURL para extrair: método, URL, headers, body.
 * NOTA: Isso não cobre 100% dos casos extremos, apenas os modelos mais comuns.
 */
export interface ParsedCurl {
  method: string;
  url: string;
  headers: { name: string; value: string }[];
  body: string;
}

export function parseCurlCommand(curlCmd: string): ParsedCurl | null {
  try {
    // Normaliza e quebra o comando em partes consideradas "seguras"
    const tokens = curlCmd
      .replace(/\\\n/g, " ") // trata breaklines
      .replace(/\s{2,}/g, " ")
      .split(" ")
      .filter(Boolean);

    if (tokens[0] !== "curl" && !tokens[0].startsWith("curl")) return null;

    let url = "";
    let method = "GET";
    let body = "";
    let headers: { name: string; value: string }[] = [];
    let i = 1;

    while (i < tokens.length) {
      const token = tokens[i];
      if (token === "-X" || token === "--request") {
        method = tokens[i + 1]?.toUpperCase() || "GET";
        i += 2;
      } else if (token === "-H" || token === "--header") {
        const header = tokens[i + 1];
        if (header) {
          const [name, ...rest] = header.replace(/^['"]|['"]$/g, "").split(":");
          headers.push({ name: name.trim(), value: rest.join(":").trim() });
        }
        i += 2;
      } else if (
        token === "-d" ||
        token === "--data" ||
        token === "--data-raw" ||
        token === "--data-binary"
      ) {
        const possibleBody = tokens[i + 1];
        if (possibleBody) {
          body += possibleBody.replace(/^['"]|['"]$/g, "");
        }
        i += 2;
      } else if (token.startsWith("http")) {
        url = token.replace(/^['"]|['"]$/g, "");
        i++;
      } else {
        i++;
      }
    }

    // Fallback se a URL não foi capturada ainda (pode estar como último argumento sem flag).
    if (!url) {
      for (let k = tokens.length - 1; k > 0; k--) {
        if (tokens[k].startsWith("http")) {
          url = tokens[k].replace(/^['"]|['"]$/g, "");
          break;
        }
      }
    }

    return {
      url,
      method,
      headers,
      body,
    };
  } catch {
    return null;
  }
}
