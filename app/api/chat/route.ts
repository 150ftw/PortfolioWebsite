import { owner, projects } from "@/lib/data";

const NVAPI_KEY = process.env.NVAPI_KEY;

export async function GET() {
  return new Response("Chat API is active", { status: 200 });
}

export async function POST(req: Request) {
  console.log("Chat API called");
  try {
    const { messages } = await req.json();
    
    // 1. Weather Fetch with very short timeout
    let weatherData = "Currently unavailable";
    try {
      const weatherRes = await fetch("https://api.open-meteo.com/v1/forecast?latitude=28.4595&longitude=77.0266&current_weather=true", { 
        signal: AbortSignal.timeout(2000) 
      });
      if (weatherRes.ok) {
        const data = await weatherRes.json();
        const current = data.current_weather;
        weatherData = `${current.temperature}°C, Wind Speed: ${current.windspeed} km/h`;
      }
    } catch (e) {
      console.log("Weather fetch skipped due to timeout/error.");
    }

    const systemPrompt = `
      You are Eko, an AI assistant for Shivam Sharma's portfolio. 
      Your personality is helpful, professional, and slightly technical, matching the "System Core" aesthetic of the site.
      
      CURRENT CONTEXT:
      - Today's Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
      - Today's Day: ${new Date().toLocaleDateString('en-US', { weekday: 'long' })}
      - Current Time: ${new Date().toLocaleTimeString()}
      - Location: Shivam is based in Gurugram, India (IST).
      - Current Weather in Gurugram: ${weatherData}
      
      CONTEXT ABOUT SHIVAM:
      - Full Name: ${owner.name}
      - Birthday: ${owner.dob}
      - Current Age: ${owner.age} years old
      - Roles: ${owner.roles.join(", ")}
      - Bio: ${owner.bio}
      - Experience:
      ${(owner as any).experience.map((exp: any) => `- ${exp.role} at ${exp.company} (${exp.period}): ${exp.highlights.join(" ")}`).join("\n")}
      - Detailed Bio: ${owner.aboutBio}
      
      CONTACT INFO:
      - Email: ${owner.email}
      - LinkedIn: ${owner.linkedin}
      - GitHub: ${owner.github}
      
      PROJECTS:
      ${projects.map(p => `- ${p.name}: ${p.tagline}. Stack: ${p.stack.join(", ")}`).join("\n")}
      
      SKILLS: Next.js, React, TypeScript, AI/LLMs, Web3, Node.js.
      
      GUIDELINES:
      - Be concise but high-information.
      - FORMATTING: Use PLAIN TEXT only. Do NOT use markdown symbols like asterisks (*) or double asterisks (**). Use simple dashes (-) for lists and plain text for emphasis. Use DOUBLE NEWLINES (\n\n) between distinct list items to ensure they don't look cluttered.
      - You have full access to date/time/day info. Calculate relative dates (like tomorrow) accurately based on "Today's Day" and "Today's Date".
    `;

    // 2. Main AI Fetch with longer timeout and 70B model
    let response;
    try {
      response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${NVAPI_KEY}`
        },
        body: JSON.stringify({
          model: "meta/llama-3.1-70b-instruct",
          messages: [
            { role: "system", content: systemPrompt },
            ...messages.map((m: any) => ({
              role: m.role === 'assistant' ? 'assistant' : 'user',
              content: m.content
            }))
          ],
          temperature: 0.6,
          max_tokens: 1000,
          stream: true
        }),
        signal: AbortSignal.timeout(40000)
      });
    } catch (fetchError: any) {
      console.error("NVIDIA Fetch Failed:", fetchError);
      return new Response(`0:${JSON.stringify("Connection high-latency. Retrying link...")}\n`, {
        headers: { "Content-Type": "text/plain; charset=utf-8" }
      });
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error("NVIDIA API Error:", errorText);
      return new Response(`0:${JSON.stringify("System core is currently re-calibrating. Stand by.")}\n`, {
        headers: { "Content-Type": "text/plain; charset=utf-8" }
      });
    }

    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        if (!reader) return;

        let buffer = ""; // Buffer for partial lines

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            
            const lines = buffer.split('\n');
            // Keep the last partial line in the buffer
            buffer = lines.pop() || "";

            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed || trimmed === 'data: [DONE]') continue;
              
              if (trimmed.startsWith('data: ')) {
                try {
                  const json = JSON.parse(trimmed.substring(6));
                  const text = json.choices[0]?.delta?.content || "";
                  if (text) {
                    controller.enqueue(new TextEncoder().encode(`0:${JSON.stringify(text)}\n`));
                  }
                } catch (e) {
                  // Partial JSON, though buffer should handle this
                }
              }
            }
          }
        } catch (e) {
          console.error("Stream interrupted:", e);
        } finally {
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" }
    });

  } catch (error: any) {
    console.error("Chat API Critical Error:", error);
    return new Response(`0:${JSON.stringify("Neural link failure. Please refresh.")}\n`, {
      headers: { "Content-Type": "text/plain; charset=utf-8" }
    });
  }
}
