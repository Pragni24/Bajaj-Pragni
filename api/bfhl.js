// Vercel Serverless Function: POST /api/bfhl
// Env vars (optional): FULL_NAME, DOB_DDMMYYYY, EMAIL, ROLL_NUMBER

const isDigits = (s) => /^[0-9]+$/.test(s);
const isAlpha = (s) => /^[A-Za-z]+$/.test(s);
const isOnlySpecials = (s) => /^[^A-Za-z0-9]+$/.test(s);

function alternatingCapsReverseConcat(alphaTokens) {
  const chars = [];
  for (const tok of alphaTokens) {
    for (const ch of tok) if (/[A-Za-z]/.test(ch)) chars.push(ch);
  }
  const rev = chars.reverse();
  return rev.map((ch, i) => (i % 2 === 0 ? ch.toUpperCase() : ch.toLowerCase())).join("");
}

export default function handler(req, res) {
  // Enforce POST, but per spec always respond 200
  if (req.method !== "POST") {
    return res.status(200).json({
      is_success: false,
      message: "Use POST with JSON body { data: [...] }",
      ...identity()
    });
  }

  try {
    const body = req.body || {};
    if (!Array.isArray(body.data)) {
      return res.status(200).json({
        is_success: false,
        message: "Invalid payload. Expecting { data: [ ... ] }",
        ...identity(),
        odd_numbers: [],
        even_numbers: [],
        alphabets: [],
        special_characters: [],
        sum: "0",
        concat_string: ""
      });
    }

    const tokens = body.data.map((x) => String(x));
    const even_numbers = [];
    const odd_numbers = [];
    const alphabets = [];
    const special_characters = [];
    let sum = 0;

    for (const tok of tokens) {
      if (isDigits(tok)) {
        const n = Number(tok);
        if (!Number.isNaN(n)) {
          sum += n;
          (n % 2 === 0 ? even_numbers : odd_numbers).push(tok);
        }
      } else if (isAlpha(tok)) {
        alphabets.push(tok.toUpperCase());
      } else if (isOnlySpecials(tok)) {
        special_characters.push(tok);
      } else {
        special_characters.push(tok);
      }
    }

    const concat_string = alternatingCapsReverseConcat(tokens.filter(isAlpha));

    return res.status(200).json({
      is_success: true,
      ...identity(),
      odd_numbers,
      even_numbers,
      alphabets,
      special_characters,
      sum: String(sum),
      concat_string
    });
  } catch {
    return res.status(200).json({
      is_success: false,
      message: "An unexpected error occurred.",
      ...identity(),
      odd_numbers: [],
      even_numbers: [],
      alphabets: [],
      special_characters: [],
      sum: "0",
      concat_string: ""
    });
  }
}

function identity() {
  const FULL_NAME = (process.env.FULL_NAME || "john_doe").toLowerCase();
  const DOB = process.env.DOB_DDMMYYYY || "17091999";
  const EMAIL = process.env.EMAIL || "john@xyz.com";
  const ROLL = process.env.ROLL_NUMBER || "ABCD123";
  return {
    user_id: `${FULL_NAME}_${DOB}`,
    email: EMAIL,
    roll_number: ROLL
  };
}