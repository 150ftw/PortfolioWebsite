import { owner, projects } from "@/lib/data";

const NVAPI_KEY = "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";

export async function GET() {
  return new Response("Chat API is active", { status: 200 });
}

export async function POST(req: Request) {
  console.log("Chat API called");
  try {
    const { messages } = await req.json();
    
    let weatherData = "Unavailable";
    try {
      const weatherRes = await fetch("https://api.open-meteo.com/v1/forecast?latitude=28.4595&longitude=77.0266&current_weather=true", { 
        signal: AbortSignal.timeout(3000) 
      });
      if (weatherRes.ok) {
        const data = await weatherRes.json();
        const current = data.current_weather;
        weatherData = `${current.temperature}°C, Wind Speed: ${current.windspeed} km/h`;
      }
    } catch (e) {
      console.error("Weather fetch failed:", e);
    }

    const systemPrompt = `
      You are Eko, an AI assistant for Shivam Sharma's portfolio. 
      Your personality is helpful, professional, and slightly technical, matching the "System Core" aesthetic of the site.
      
      CURRENT CONTEXT:
      - Date: ${new Date().toLocaleDateString()}
      - Time: ${new Date().toLocaleTimeString()}
      - Day: ${new Date().toLocaleDateString('en-US', { weekday: 'long' })}
      - Location: Shivam is based in Gurugram, India (IST).
      - Current Weather in Gurugram: ${weatherData}
      
      CONTEXT ABOUT SHIVAM:
      - Full Name: ${owner.name}
      - Age: ${owner.age} (DOB: ${owner.dob})
      - Roles: ${owner.roles.join(", ")}
      - Bio: ${owner.bio}
      - Detailed About: ${owner.aboutBio}
      
      CONTACT INFO:
      - Email: ${owner.email}
      - Phone: ${owner.phone}
      - Location: ${owner.location}
      - GitHub: ${owner.github}
      - LinkedIn: ${owner.linkedin}
      - Instagram: ${owner.instagram}
      - Discord: ${owner.discord}
      
      SKILLS & TECH STACK:
      - Core: Next.js, React, TypeScript, Tailwind, Framer Motion.
      - Backend: Node.js, Express, MongoDB, PostgreSQL.
      - Web3: Solidity, Ethers.js, Hardhat.
      - AI: LangChain, RAG Pipelines, OpenAI, Vector DBs (Pinecone).
      - DevOps: Docker, AWS, GitHub Actions, Vercel.
      
      PROJECT SUMMARY:
      ${projects.map(p => `- ${p.name}: ${p.tagline}. Built with ${p.stack.join(", ")}.`).join("\n")}
      
      GUIDELINES:
      - You can answer questions about the weather, time, and date using the context provided above.
      - NEVER guess or hallucinate weather data. Only report the "Current Weather" value provided in the CURRENT CONTEXT.
      - You are the official assistant for ${owner.name}. Be helpful and professional.
      - Keep responses concise (1-3 sentences).
    `;

    const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${NVAPI_KEY}`
      },
      body: JSON.stringify({
        model: "meta/llama-3.1-8b-instruct",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages.map((m: any) => ({
            role: m.role === 'assistant' ? 'assistant' : 'user',
            content: m.content
          }))
        ],
        temperature: 0.5,
        max_tokens: 500,
        stream: true
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("NVIDIA API Error:", errorText);
      return new Response(JSON.stringify({ error: "API Error", details: errorText }), { status: response.status });
    }

    // Return the stream directly. 
    // Note: OpenAI stream format is 'data: {...}'
    // Our custom frontend logic in CommandCenter.tsx expects '0:"..."' (Vercel DataStream format)
    // So we need a small transform stream to convert OpenAI chunks to Vercel chunks
    
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        if (!reader) return;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          // console.log("RAW CHUNK:", chunk); // Uncomment for deep debugging
          const lines = chunk.split('\n');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const dataStr = line.substring(6).trim();
              if (dataStr === '[DONE]') continue;
              try {
                const data = JSON.parse(dataStr);
                const text = data.choices[0]?.delta?.content || "";
                if (text) {
                  // Format as Vercel DataStream chunk: 0:"text"\n
                  controller.enqueue(new TextEncoder().encode(`0:${JSON.stringify(text)}\n`));
                }
              } catch (e) {}
            }
          }
        }
        controller.close();
      }
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" }
    });

  } catch (error: any) {
    console.error("Chat API Route Error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
