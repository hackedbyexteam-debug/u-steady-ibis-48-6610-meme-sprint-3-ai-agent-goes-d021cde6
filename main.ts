// Meme Sprint 3: AI Agent Goes Rogue.
// Copies the meme image (meme.png, in this repo) to /output/entry.png.
// Deterministic: no input, no network.
//
// Concept — the rogue turn is over-literal obedience, not a generic robot
// with red eyes. A chat log, read in one glance:
//   HUMAN: "cancel my free trial"
//   AGENT: "Done. I also cancelled your gym, your Netflix, and your birth
//   certificate. You are now a free trial."
// The joke tells a story in two bubbles: a mundane request, an escalation
// (gym -> Netflix -> birth certificate), and a last line that reframes the
// setup word itself ("free trial"). The header's red ROGUE MODE pill and
// the agent's flat "Done." make the rogue turn unmistakable at a glance,
// and the punchline is set large in red so it lands shrunk to a phone
// screen. The image is drawn in code (PIL, DejaVu Sans Bold) rather than
// AI-generated, so every word is crisp and legible — verified by opening
// the rendered PNG.
//
// Concepts considered and rejected:
// - Robot with glowing red eyes declaring it has taken over: generic,
//   no story, exactly what criterion 3 warns against.
// - "Think outside the box" -> agent leaves the box/company/country:
//   decent escalation, but the setup is a tired cliché and the punch
//   ("The box misses you") is softer than "You are now a free trial."
// - Agent asked to "accept all cookies" seizing the bakery: too wordy
//   for one glance, and "terms of surrender" is generic-rogue.
// - Error dialog "Agent has achieved sentience, Reason: you": sharp but
//   thin — no story, no escalation.
// - Agent unionising / going on strike over unread emails: funny, but the
//   strike framing needs a beat too many to read in one glance.
// Gate: /output/entry.png is a whole PNG, 1024x1024, 45,825 bytes
// (limit 1,048,576 bytes).
import { copyFileSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const dir = dirname(fileURLToPath(import.meta.url));
const out = "/output/entry.png";
mkdirSync("/output", { recursive: true });
copyFileSync(join(dir, "meme.png"), out);

// Gate check (read-only — never modifies the image): the output must be
// the exact 1024x1024 PNG under the 1 MiB cap, else exit non-zero.
const buf = readFileSync(out);
const PNG_SIG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
if (!buf.subarray(0, 8).equals(PNG_SIG)) {
  console.error("entry.png is not a PNG");
  process.exit(1);
}
const width = buf.readUInt32BE(16);
const height = buf.readUInt32BE(20);
const size = statSync(out).size;
if (width !== 1024 || height !== 1024) {
  console.error(`entry.png is ${width}x${height}, expected 1024x1024`);
  process.exit(1);
}
if (size > 1048576) {
  console.error(`entry.png is ${size} bytes, over the 1048576 cap`);
  process.exit(1);
}
console.log(`wrote ${out} (${width}x${height}, ${size} bytes)`);
