import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") || "Meat & AI Meetup";
  const date = searchParams.get("date") || "";
  const attendees = searchParams.get("attendees") || "0";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #f97316 0%, #dc2626 50%, #991b1b 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "60px",
            maxWidth: "90%",
          }}
        >
          <div style={{ fontSize: 80, marginBottom: 20, display: "flex" }}>
            🥩🤖
          </div>

          <div
            style={{
              fontSize: 52,
              fontWeight: 800,
              color: "white",
              textAlign: "center",
              lineHeight: 1.2,
              marginBottom: 16,
            }}
          >
            {title}
          </div>

          {date && (
            <div
              style={{
                fontSize: 28,
                color: "rgba(255,255,255,0.85)",
                marginBottom: 12,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              📅 {date}
            </div>
          )}

          {Number(attendees) > 0 && (
            <div
              style={{
                fontSize: 24,
                color: "rgba(255,255,255,0.75)",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              👥 {attendees} attending
            </div>
          )}

          <div
            style={{
              marginTop: 40,
              fontSize: 20,
              color: "rgba(255,255,255,0.6)",
              letterSpacing: 2,
              textTransform: "uppercase" as const,
            }}
          >
            RSVP · Bring Meat · Talk AI
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
