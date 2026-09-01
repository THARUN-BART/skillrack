require('dotenv').config();
const { chromium } = require('playwright');
const Tesseract = require('tesseract.js');

// ─── Configuration ──────────────────────────────────────────────
const DELAY_BETWEEN_PROBLEMS_MS = 2000;
const CAPTCHA_MAX_RETRIES = 5;
const GLOBAL_MAX_SOLVED = parseInt(process.env.MAX_SOLVED || '200', 10);

// CLI filter argument: node solve.js [java|cpp|c++|c|python|all]
const rawArg = (process.argv[2] || '').toLowerCase().trim();
let filterLang = 'all';
if (rawArg.includes('java')) filterLang = 'java';
else if (rawArg.includes('c++') || rawArg.includes('cpp')) filterLang = 'cpp';
else if (rawArg === 'c') filterLang = 'c';
else if (rawArg.includes('python') || rawArg.includes('py')) filterLang = 'python';

// ─── Track Constructors ─────────────────────────────────────────
function createTutorTrack({ categoryRegex, trackRegex, displayName, language, languageCode, groupType = 'CODETUTOR', prefix = 'PART' }) {
    return {
        name: displayName,
        language: language,
        languageCode: languageCode,
        prefix: prefix,
        groupType: groupType,
        navigate: async (page) => {
            const url = `https://www.skillrack.com/faces/candidate/codeprogramgroup.xhtml?gt=${groupType}`;
            await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
            await sleep(1000);

            if (categoryRegex) {
                // Exact row match inside table to avoid selecting parent card container
                const catRow = page.locator('table tr, .padtbl tr').filter({ hasText: categoryRegex }).first();
                const showCat = catRow.locator('button:has-text("Show")').first();
                if (await showCat.isVisible({ timeout: 5000 }).catch(() => false)) {
                    await showCat.click();
                    await page.waitForLoadState('domcontentloaded', { timeout: 20000 }).catch(() => {});
                    await sleep(1500);
                }
            }

            if (trackRegex) {
                // Exact row match inside subtrack table
                const trackRow = page.locator('table tr, .padtbl tr').filter({ hasText: trackRegex }).first();
                const showTrack = trackRow.locator('button:has-text("Show")').first();
                if (await showTrack.isVisible({ timeout: 5000 }).catch(() => false)) {
                    await showTrack.click();
                    await page.waitForLoadState('domcontentloaded', { timeout: 20000 }).catch(() => {});
                    await sleep(1500);
                }
            }
        }
    };
}

// ─── Track Catalog (Solution-Enabled / Hands-On / Challenge Tracks) ──
const ALL_TRACKS = [
    // ──────── C++ (CPP) TRACKS ────────
    createTutorTrack({
        categoryRegex: /C\+\+ Programming/i,
        trackRegex: /C\+\+ -\s*50 VERY-EASY CHALLENGES/i,
        displayName: 'C++ - 50 VERY-EASY CHALLENGES',
        language: 'C++',
        languageCode: '2',
        prefix: 'PART'
    }),
    createTutorTrack({
        categoryRegex: /C\+\+ Programming/i,
        trackRegex: /C\+\+ -\s*50 EASY CHALLENGES/i,
        displayName: 'C++ - 50 EASY CHALLENGES',
        language: 'C++',
        languageCode: '2',
        prefix: 'PART'
    }),
    createTutorTrack({
        categoryRegex: /C\+\+ Programming/i,
        trackRegex: /C\+\+ -\s*50 AVERAGE CHALLENGES/i,
        displayName: 'C++ - 50 AVERAGE CHALLENGES',
        language: 'C++',
        languageCode: '2',
        prefix: 'PART'
    }),
    createTutorTrack({
        categoryRegex: /C\+\+ Programming/i,
        trackRegex: /C\+\+ -\s*STARTER/i,
        displayName: 'C++ - STARTER',
        language: 'C++',
        languageCode: '2',
        prefix: 'PART'
    }),
    createTutorTrack({
        categoryRegex: /C\+\+ Programming/i,
        trackRegex: /C\+\+ Primer/i,
        displayName: 'C++ Primer',
        language: 'C++',
        languageCode: '2',
        prefix: 'PART'
    }),

    // ──────── JAVA TRACKS ────────
    createTutorTrack({
        categoryRegex: /Java Programming/i,
        trackRegex: /Java Basics - Programming Course \(Hands-On\)/i,
        displayName: 'Java Basics - Programming Course (Hands-On)',
        language: 'Java',
        languageCode: '3',
        prefix: 'JAVA-H'
    }),
    createTutorTrack({
        categoryRegex: /Java Programming/i,
        trackRegex: /JAVA -\s*50 VERY-EASY CHALLENGES/i,
        displayName: 'JAVA - 50 VERY-EASY CHALLENGES',
        language: 'Java',
        languageCode: '3',
        prefix: 'PART'
    }),
    createTutorTrack({
        categoryRegex: /Java Programming/i,
        trackRegex: /JAVA -\s*50 EASY CHALLENGES/i,
        displayName: 'JAVA - 50 EASY CHALLENGES',
        language: 'Java',
        languageCode: '3',
        prefix: 'PART'
    }),
    createTutorTrack({
        categoryRegex: /Java Programming/i,
        trackRegex: /JAVA -\s*50 AVERAGE CHALLENGES/i,
        displayName: 'JAVA - 50 AVERAGE CHALLENGES',
        language: 'Java',
        languageCode: '3',
        prefix: 'PART'
    }),
    createTutorTrack({
        categoryRegex: /Java Programming/i,
        trackRegex: /JAVA -\s*STARTER/i,
        displayName: 'JAVA - STARTER',
        language: 'Java',
        languageCode: '3',
        prefix: 'PART'
    }),
    createTutorTrack({
        categoryRegex: /Data Structures in Java/i,
        trackRegex: /Data Structures in Java/i,
        displayName: 'Data Structures in Java Pro',
        language: 'Java',
        languageCode: '3',
        prefix: 'PART'
    }),

    // ──────── C TRACKS ────────
    createTutorTrack({
        categoryRegex: /C Programming/i,
        trackRegex: /C - INTRO \(Code Solution\)/i,
        displayName: 'C - INTRO (Code Solution)',
        language: 'C',
        languageCode: '1',
        prefix: 'PART'
    }),
    createTutorTrack({
        categoryRegex: /C Programming/i,
        trackRegex: /C - INPUT\/OUTPUT \(Video Explanation\)/i,
        displayName: 'C - INPUT/OUTPUT (Video Explanation)',
        language: 'C',
        languageCode: '1',
        prefix: 'PART'
    }),
    createTutorTrack({
        categoryRegex: /C Programming/i,
        trackRegex: /C - ARITHMETIC OPERATORS \(Video Explanation\)/i,
        displayName: 'C - ARITHMETIC OPERATORS (Video Explanation)',
        language: 'C',
        languageCode: '1',
        prefix: 'PART'
    }),
    createTutorTrack({
        categoryRegex: /C Programming/i,
        trackRegex: /C - IF ELSE \(Video Explanation\)/i,
        displayName: 'C - IF ELSE (Video Explanation)',
        language: 'C',
        languageCode: '1',
        prefix: 'PART'
    }),
    createTutorTrack({
        categoryRegex: /C Programming/i,
        trackRegex: /C - NESTED IF ELSE \(Video Explanation\)/i,
        displayName: 'C - NESTED IF ELSE (Video Explanation)',
        language: 'C',
        languageCode: '1',
        prefix: 'PART'
    }),
    createTutorTrack({
        categoryRegex: /C Programming/i,
        trackRegex: /C - LOOPS \(Video Explanation\)/i,
        displayName: 'C - LOOPS (Video Explanation)',
        language: 'C',
        languageCode: '1',
        prefix: 'PART'
    }),
    createTutorTrack({
        categoryRegex: /C Programming/i,
        trackRegex: /C - NESTED LOOPS AND PATTERNS \(Video Explanation\)/i,
        displayName: 'C - NESTED LOOPS AND PATTERNS (Video Explanation)',
        language: 'C',
        languageCode: '1',
        prefix: 'PART'
    }),
    createTutorTrack({
        categoryRegex: /C Programming/i,
        trackRegex: /C - ARRAY \(Video Explanation\)/i,
        displayName: 'C - ARRAY (Video Explanation)',
        language: 'C',
        languageCode: '1',
        prefix: 'PART'
    }),
    createTutorTrack({
        categoryRegex: /C Programming/i,
        trackRegex: /C - STRING \(Video Explanation\)/i,
        displayName: 'C - STRING (Video Explanation)',
        language: 'C',
        languageCode: '1',
        prefix: 'PART'
    }),
    createTutorTrack({
        categoryRegex: /C Programming/i,
        trackRegex: /C - MATRIX \(Video Explanation\)/i,
        displayName: 'C - MATRIX (Video Explanation)',
        language: 'C',
        languageCode: '1',
        prefix: 'PART'
    }),
    createTutorTrack({
        categoryRegex: /C Programming/i,
        trackRegex: /C -\s*50 VERY-EASY CHALLENGES/i,
        displayName: 'C - 50 VERY-EASY CHALLENGES',
        language: 'C',
        languageCode: '1',
        prefix: 'PART'
    }),
    createTutorTrack({
        categoryRegex: /C Programming/i,
        trackRegex: /C -\s*50 EASY CHALLENGES/i,
        displayName: 'C - 50 EASY CHALLENGES',
        language: 'C',
        languageCode: '1',
        prefix: 'PART'
    }),
    createTutorTrack({
        categoryRegex: /C Programming/i,
        trackRegex: /C -\s*50 EASY ADD-ON CHALLENGES/i,
        displayName: 'C - 50 EASY ADD-ON CHALLENGES',
        language: 'C',
        languageCode: '1',
        prefix: 'PART'
    }),
    createTutorTrack({
        categoryRegex: /C Programming/i,
        trackRegex: /C -\s*50 AVERAGE CHALLENGES/i,
        displayName: 'C - 50 AVERAGE CHALLENGES',
        language: 'C',
        languageCode: '1',
        prefix: 'PART'
    }),
    createTutorTrack({
        categoryRegex: /C Programming/i,
        trackRegex: /C - Programming Course \(Hands-On\)/i,
        displayName: 'C - Programming Course (Hands-On)',
        language: 'C',
        languageCode: '1',
        prefix: 'UNIT'
    }),

    // ──────── PYTHON TRACKS ────────
    createTutorTrack({
        categoryRegex: /Python Programming/i,
        trackRegex: /Python 3\.x - Programming Course \(Hands-On\)/i,
        displayName: 'Python 3.x - Programming Course (Hands-On)',
        language: 'Python3',
        languageCode: '7',
        prefix: 'PYTHON3-H'
    }),
    createTutorTrack({
        categoryRegex: /Python Programming/i,
        trackRegex: /PYTHON3\.x -\s*50 VERY-EASY CHALLENGES/i,
        displayName: 'PYTHON3.x - 50 VERY-EASY CHALLENGES',
        language: 'Python3',
        languageCode: '7',
        prefix: 'PART'
    }),
    createTutorTrack({
        categoryRegex: /Python Programming/i,
        trackRegex: /PYTHON3\.x -\s*50 EASY CHALLENGES/i,
        displayName: 'PYTHON3.x - 50 EASY CHALLENGES',
        language: 'Python3',
        languageCode: '7',
        prefix: 'PART'
    }),
    createTutorTrack({
        categoryRegex: /Python Programming/i,
        trackRegex: /PYTHON3\.x -\s*50 AVERAGE CHALLENGES/i,
        displayName: 'PYTHON3.x - 50 AVERAGE CHALLENGES',
        language: 'Python3',
        languageCode: '7',
        prefix: 'PART'
    }),
    createTutorTrack({
        categoryRegex: /Python Programming/i,
        trackRegex: /Python -\s*STARTER/i,
        displayName: 'Python - STARTER',
        language: 'Python3',
        languageCode: '7',
        prefix: 'PART'
    }),

    // ──────── KICKSTART ────────
    {
        name: 'KICKSTART',
        language: 'Python3',
        languageCode: '7',
        prefix: 'SET',
        groupType: 'CODETRACK',
        navigate: async (page) => {
            await page.goto('https://www.skillrack.com/faces/candidate/codeprogramgroup.xhtml?gt=CODETRACK&lev=2', { waitUntil: 'domcontentloaded', timeout: 30000 });
            await sleep(1000);

            const showBtn1 = page.locator('table tr, div.ui-card-content', { hasText: /KICKSTART/i })
                .locator('button:has-text("Show")').first();
            if (await showBtn1.isVisible({ timeout: 5000 }).catch(() => false)) {
                await showBtn1.click();
                await page.waitForLoadState('domcontentloaded', { timeout: 20000 }).catch(() => {});
                await sleep(1000);
            }

            const showBtn2 = page.locator('table tr, div.ui-card-content', { hasText: /KICKSTART \(Code Solution\)/i })
                .locator('button:has-text("Show")').first();
            if (await showBtn2.isVisible({ timeout: 5000 }).catch(() => false)) {
                await showBtn2.click();
                await page.waitForLoadState('domcontentloaded', { timeout: 20000 }).catch(() => {});
                await sleep(1000);
            }
        }
    }
];

// Filter tracks based on CLI argument if provided
const TRACKS = ALL_TRACKS.filter(t => {
    if (filterLang === 'all') return true;
    if (filterLang === 'java') return t.language === 'Java';
    if (filterLang === 'cpp') return t.language === 'C++';
    if (filterLang === 'c') return t.language === 'C';
    if (filterLang === 'python') return t.language === 'Python3';
    return true;
});

// ─── Utility helpers ────────────────────────────────────────────
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function log(msg) {
    const ts = new Date().toLocaleTimeString();
    console.log(`[${ts}] ${msg}`);
}

// ─── Gemini AI Solver ───────────────────────────────────────────
async function extractProblemDetails(page) {
    return await page.evaluate(() => {
        const panel = document.querySelector('#codeeditorpanel') || document.querySelector('#programgrid') || document.body;
        const clone = panel.cloneNode(true);
        const unwanted = clone.querySelectorAll('#txtCodeTbl, #codediv, script, style, canvas, img, button, input[type="submit"]');
        unwanted.forEach(el => el.remove());
        return (clone.innerText || clone.textContent || '').trim();
    });
}

async function generateSolutionWithGemini(problemText, targetLang, prefix = '', suffix = '') {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error('GEMINI_API_KEY is not defined in your .env file');
    }

    const systemInstruction = `You are an expert competitive programmer. 
Your task is to write clean, correct, bug-free code in ${targetLang} to solve the given coding challenge.
CRITICAL RULES:
1. Return ONLY the executable code.
2. Do NOT wrap the code in markdown codeblocks (no \`\`\`${targetLang} or \`\`\`).
3. Do NOT include any conversational text, explanations, or commentary.
4. Strictly read input from stdin and write output to stdout.
5. Cover all boundary conditions and edge cases.
6. If Prefix or Suffix code is provided, output ONLY the missing code snippet that fits in between.`;

    const userPrompt = `Problem Description:
${problemText}

Target Language: ${targetLang}
${prefix ? `\nPrefix Code (already present, do NOT repeat):\n${prefix}\n` : ''}
${suffix ? `\nSuffix Code (already present, do NOT repeat):\n${suffix}\n` : ''}
`;

    const models = [
        'gemini-2.5-flash',
        'gemini-2.0-flash',
        'gemini-2.5-flash-lite',
        'gemini-3.7-flash',
        'gemini-3.6-flash',
        'gemini-1.5-flash',
        'gemini-2.5-pro'
    ];

    for (const model of models) {
        for (let attempt = 1; attempt <= 2; attempt++) {
            try {
                const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
                const payload = {
                    contents: [
                        {
                            role: 'user',
                            parts: [{ text: `${systemInstruction}\n\n${userPrompt}` }]
                        }
                    ],
                    generationConfig: {
                        temperature: 0.1,
                        maxOutputTokens: 2048,
                    }
                };

                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    if (response.status === 404) break;
                    log(`  Warning: Gemini model ${model} (attempt ${attempt}) returned ${response.status}`);
                    if (attempt < 2) {
                        await sleep(1500);
                        continue;
                    }
                    break;
                }

                const data = await response.json();
                const candidate = data.candidates?.[0]?.content?.parts?.[0]?.text;
                if (candidate) {
                    let code = candidate.trim();
                    code = code.replace(/^```[a-zA-Z0-9_+-]*\n?/, '').replace(/\n?```$/, '').trim();
                    log(`  ✓ Generated with model: ${model}`);
                    return code;
                }
            } catch (err) {
                log(`  Warning: Gemini request failed with model ${model}: ${err.message}`);
                if (attempt < 2) await sleep(1000);
            }
        }
    }

    throw new Error('Failed to generate solution with Gemini AI across available models');
}

// ─── Captcha solver ─────────────────────────────────────────────
async function solveCaptchaFromPage(page) {
    await page.evaluate(() => {
        const img = document.querySelector('#codeeditorpanel img[src^="data:image"]');
        if (!img) return;

        const SCALE = 4;
        const canvas = document.createElement('canvas');
        canvas.id = '__captcha_canvas__';
        canvas.width = img.naturalWidth * SCALE;
        canvas.height = img.naturalHeight * SCALE;
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.zIndex = '99999';
        canvas.style.background = 'white';

        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        document.body.appendChild(canvas);
    });

    const canvasEl = page.locator('#__captcha_canvas__');
    const screenshotBuffer = await canvasEl.screenshot();

    await page.evaluate(() => {
        const c = document.getElementById('__captcha_canvas__');
        if (c) c.remove();
    });

    const { data: { text } } = await Tesseract.recognize(screenshotBuffer, 'eng', {
        logger: () => {},
    }, {
        tessedit_char_whitelist: '0123456789+-*xX/=',
        tessedit_pageseg_mode: '6',
    });

    log(`  Captcha OCR raw text: "${text.trim()}"`);

    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    let arithmeticLine = null;

    for (const line of lines) {
        if (/[\+\-\*xX\/]/.test(line) && line.includes('=')) {
            arithmeticLine = line;
            break;
        }
    }
    if (!arithmeticLine) {
        for (let i = lines.length - 1; i >= 0; i--) {
            if (lines[i].includes('=')) { arithmeticLine = lines[i]; break; }
        }
    }

    if (!arithmeticLine) {
        throw new Error(`Could not find arithmetic line. Lines: ${JSON.stringify(lines)}`);
    }

    let cleaned = arithmeticLine;
    cleaned = cleaned.replace(/[FBSbs]/g, '8');
    cleaned = cleaned.replace(/[lI|!]/g, '1');
    cleaned = cleaned.replace(/[Oo]/g, '0');
    cleaned = cleaned.replace(/[^0-9\+\-\*xX\/=]/g, '');

    function evaluateOp(a, op, b) {
        switch (op) {
            case '+': return a + b;
            case '-': return a - b;
            case '*':
            case 'x':
            case 'X': return a * b;
            case '/': return Math.floor(a / b);
            default: return a + b;
        }
    }

    let match = cleaned.match(/(\d+)\s*([\+\-\*xX\/])\s*(\d+)=/);
    if (match) {
        const a = parseInt(match[1], 10);
        const op = match[2];
        const b = parseInt(match[3], 10);
        if (a <= 999 && b <= 999) {
            const res = evaluateOp(a, op, b);
            log(`  Captcha: ${a} ${op} ${b} = ${res}`);
            return res;
        }
    }

    const digitsBeforeEquals = cleaned.replace('=', '');
    for (let splitPos = 1; splitPos < digitsBeforeEquals.length; splitPos++) {
        const aStr = digitsBeforeEquals.substring(0, splitPos);
        const bStr = digitsBeforeEquals.substring(splitPos);
        const a = parseInt(aStr, 10);
        const b = parseInt(bStr, 10);

        if (a >= 1 && a <= 999 && b >= 1 && b <= 999) {
            const result = a + b;
            log(`  Brute-force fallback split: ${a} + ${b} = ${result}`);
            return result;
        }
    }

    throw new Error(`Could not parse arithmetic from: "${arithmeticLine}"`);
}

// ─── Login ──────────────────────────────────────────────────────
async function login(page) {
    log('Navigating to SkillRack...');
    await page.goto('https://www.skillrack.com/faces/candidate/codeprogram.xhtml', {
        waitUntil: 'domcontentloaded',
        timeout: 60000
    });

    if (await page.locator('input[name="j_username"]').isVisible().catch(() => false)) {
        log('Login page detected. Logging in...');
        await page.fill('input[name="j_username"]', process.env.SKILLRACK_LOGIN_ID);
        await page.fill('input[name="j_password"]', process.env.SKILLRACK_PASSWORD);

        await Promise.all([
            page.click('input[type="submit"][value="Login"]'),
            page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => {})
        ]);

        const logoutVisible = await page.locator('a:has-text("Logout"):visible').count()
            .then(c => c > 0).catch(() => false);
        const homeVisible = await page.locator('a:has-text("Home"):visible').count()
            .then(c => c > 0).catch(() => false);
        const stillOnLoginForm = await page.locator('input[name="j_username"]')
            .isVisible({ timeout: 3000 }).catch(() => false);

        if (!logoutVisible && !homeVisible && stillOnLoginForm) {
            await page.screenshot({ path: 'debug-login-failure.png' });
            throw new Error('Login failed');
        }
        log('Login successful.');
    } else {
        log('Already logged in.');
    }
}

// ─── Solve a single problem on the solve page ───────────────────
async function solveProblem(page, track) {
    log('  Solving captcha...');
    let captchaSolved = false;

    for (let attempt = 1; attempt <= CAPTCHA_MAX_RETRIES; attempt++) {
        try {
            const hasCaptchaImg = await page.locator('#codeeditorpanel img[src^="data:image"]').count();

            if (hasCaptchaImg === 0) {
                const editorVisible = await page.locator('#txtCodeTbl').isVisible({ timeout: 3000 }).catch(() => false);
                if (editorVisible) {
                    log('  Editor already visible, captcha not required.');
                    captchaSolved = true;
                    break;
                }
                const proceedBtn = page.locator('button#proceedbtn, button:has-text("Proceed to Solve")');
                if (await proceedBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
                    await proceedBtn.click();
                    await sleep(1500);
                    captchaSolved = true;
                    break;
                }
            }

            const answer = await solveCaptchaFromPage(page);
            await page.fill('input#capval', String(answer));
            await page.click('button#proceedbtn');

            let editorAppeared = false;
            for (let poll = 0; poll < 16; poll++) {
                await sleep(500);
                const state = await page.evaluate(() => {
                    const tbl = document.querySelector('#txtCodeTbl');
                    const editorVisible = tbl && tbl.style.display !== 'none';
                    const captchaStillThere = !!document.querySelector('input#capval');
                    return { editorVisible, captchaStillThere };
                });
                if (state.editorVisible) { editorAppeared = true; break; }
                if (state.captchaStillThere && poll >= 2) {
                    throw new Error('Wrong captcha answer (captcha form still visible)');
                }
            }
            if (!editorAppeared) throw new Error('Editor did not appear after captcha submit');

            await sleep(1500);
            captchaSolved = true;
            log('  Captcha solved successfully.');
            break;
        } catch (err) {
            log(`  Captcha attempt ${attempt} failed: ${err.message}`);
            if (attempt < CAPTCHA_MAX_RETRIES) {
                log('  Reloading problem for fresh captcha...');
                const backBtn = page.locator('button:has-text("Back To Challenges List")');
                if (await backBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
                    await Promise.all([
                        backBtn.click(),
                        page.waitForNavigation({ waitUntil: 'load', timeout: 15000 }).catch(() => {})
                    ]);
                } else {
                    await page.goBack({ waitUntil: 'load', timeout: 15000 }).catch(() => {});
                }
                await sleep(1000);

                const solveBtn = page.locator('#pctbl_content button:has-text("Solve")').first();
                if (await solveBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
                    await Promise.all([
                        solveBtn.click(),
                        page.waitForNavigation({ waitUntil: 'load', timeout: 15000 }).catch(() => {})
                    ]);
                    await sleep(1000);
                }
            }
        }
    }

    if (!captchaSolved) {
        log('  FAILED to solve captcha after all retries. Skipping this problem.');
        await page.screenshot({ path: `debug-captcha-fail-${Date.now()}.png` });
        return false;
    }

    // Step 2: Change language to target language
    log(`  Changing language to ${track.language}...`);
    try {
        const currentLang = await page.evaluate(() => {
            const label = document.querySelector('#langs_label');
            return label ? label.textContent.trim() : '';
        });

        let targetRegex = new RegExp(`^${track.language}$`, 'i');
        if (track.language === 'C++') {
            targetRegex = /C\+\+|CPP/i;
        } else if (track.language === 'Python3') {
            targetRegex = /Python3|Python/i;
        }

        if (currentLang === '') {
            log('  No language dropdown found. Assuming default language is set.');
        } else if (targetRegex.test(currentLang)) {
            log(`  Already set to ${currentLang}.`);
        } else {
            await page.click('#langs_label');
            await sleep(500);

            const langItem = page.locator('#langs_panel li').filter({ hasText: targetRegex });
            if (await langItem.count() > 0) {
                await langItem.first().click();
            } else {
                await page.click(`#langs_panel >> text=${track.language}`);
            }

            await page.waitForLoadState('domcontentloaded', { timeout: 15000 }).catch(() => {});
            await sleep(1500);

            const newLang = await page.evaluate(() => {
                const label = document.querySelector('#langs_label');
                return label ? label.textContent.trim() : '';
            });
            log(`  Language is now: ${newLang}`);
        }
    } catch (err) {
        log(`  Warning: Language change via UI failed: ${err.message}`);
        try {
            await page.evaluate((code) => {
                const sel = document.getElementById('langs_input');
                if (sel) {
                    sel.value = code;
                    sel.dispatchEvent(new Event('change', { bubbles: true }));
                }
            }, track.languageCode);
            await sleep(2000);
        } catch (e) {}
    }

    // Step 3: Extract solution (DOM first, then AI fallback)
    log(`  Checking for existing solution in DOM...`);
    let solutionCode = await page.evaluate((lang) => {
        const cleanLang = lang.replace(/\s+/g, '').replace(/\+\+/g, 'PP');
        const selectors = [
            `#soln${cleanLang} pre`,
            `#soln${lang.replace(/\s+/g, '')} pre`,
            `#solnCPP pre`,
            `#solnCPP23 pre`,
            `#solnC pre`,
            `#solnJava pre`,
            `#solnPython3 pre`,
            `#solnPython pre`,
            `div[id^="soln"] pre`
        ];
        for (const sel of selectors) {
            const el = document.querySelector(sel);
            if (el && el.textContent.trim().length > 0) {
                let text = el.textContent || el.innerText || '';
                return text.replace(/\u00a0/g, '').trimEnd();
            }
        }
        return null;
    }, track.language);

    if (!solutionCode) {
        try {
            const showBtn = page.locator('#showbtn');
            if (await showBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
                log('  Clicking "View Solution" button to reveal hidden solution...');
                await showBtn.click();
                await sleep(500);
                await page.evaluate((lang) => {
                    const cleanLang = lang.replace(/\s+/g, '').replace(/\+\+/g, 'PP');
                    if (typeof showHideSoln === 'function') {
                        showHideSoln(cleanLang);
                        showHideSoln('CPP');
                        showHideSoln('CPP23');
                        showHideSoln('C++');
                        showHideSoln('Java');
                    }
                }, track.language);
                await sleep(500);

                solutionCode = await page.evaluate((lang) => {
                    const cleanLang = lang.replace(/\s+/g, '').replace(/\+\+/g, 'PP');
                    const selectors = [
                        `#soln${cleanLang} pre`,
                        `#soln${lang.replace(/\s+/g, '')} pre`,
                        `#solnCPP pre`,
                        `#solnCPP23 pre`,
                        `#solnC pre`,
                        `#solnJava pre`,
                        `#solnPython3 pre`,
                        `div[id^="soln"] pre`
                    ];
                    for (const sel of selectors) {
                        const el = document.querySelector(sel);
                        if (el && el.textContent.trim().length > 0) {
                            let text = el.textContent || el.innerText || '';
                            return text.replace(/\u00a0/g, '').trimEnd();
                        }
                    }
                    return null;
                }, track.language);
            }
        } catch (e) {}
    }

    // Check for fill-in-the-blanks template
    const { prefix, suffix } = await page.evaluate(() => {
        let pref = '', suff = '';
        const codediv = document.getElementById('codediv');
        if (codediv) {
            const panels = codediv.querySelectorAll('.ui-outputpanel > pre');
            const txtCode = document.getElementById('txtCode');
            for (let i = 0; i < panels.length; i++) {
                const pre = panels[i];
                const panelDiv = pre.parentElement;
                if (txtCode && (panelDiv.compareDocumentPosition(txtCode) & Node.DOCUMENT_POSITION_FOLLOWING)) {
                    pref = pre.textContent || pre.innerText || '';
                } else if (txtCode && (txtCode.compareDocumentPosition(panelDiv) & Node.DOCUMENT_POSITION_FOLLOWING)) {
                    suff = pre.textContent || pre.innerText || '';
                }
            }
        }
        return { prefix: pref, suffix: suff };
    });

    if (solutionCode && solutionCode.trim().length > 0) {
        log(`  ✓ Found pre-existing solution in DOM (${solutionCode.length} chars). No AI needed.`);
        if (prefix || suffix) {
            log(`  Stripping prefix / suffix template...`);
            solutionCode = await page.evaluate(({ fullCode, p, s }) => {
                let startIdx = 0;
                let endIdx = fullCode.length;

                if (p) {
                    let f = 0, pi = 0;
                    while (f < fullCode.length && pi < p.length) {
                        if (/\s/.test(fullCode[f]) && /\s/.test(p[pi])) { f++; pi++; continue; }
                        if (/\s/.test(fullCode[f])) { f++; continue; }
                        if (/\s/.test(p[pi])) { pi++; continue; }
                        if (fullCode[f] === p[pi]) { f++; pi++; }
                        else break;
                    }
                    if (pi === p.length) startIdx = f;
                }

                if (s) {
                    let f = fullCode.length - 1, si = s.length - 1;
                    while (f >= startIdx && si >= 0) {
                        if (/\s/.test(fullCode[f]) && /\s/.test(s[si])) { f--; si--; continue; }
                        if (/\s/.test(fullCode[f])) { f--; continue; }
                        if (/\s/.test(s[si])) { si--; continue; }
                        if (fullCode[f] === s[si]) { f--; si--; }
                        else break;
                    }
                    if (si < 0) endIdx = f + 1;
                }

                return fullCode.substring(startIdx, endIdx).replace(/^\n+|\n+$/g, '');
            }, { fullCode: solutionCode, p: prefix, s: suffix });
        }
    } else {
        log('  ℹ No existing solution found in DOM. Querying Gemini AI...');
        try {
            const problemText = await extractProblemDetails(page);
            log(`  Scraped problem (${problemText.length} chars). Generating code with Gemini...`);
            solutionCode = await generateSolutionWithGemini(problemText, track.language, prefix, suffix);
            log(`  ✓ Gemini generated code (${solutionCode.length} chars).`);
        } catch (err) {
            log(`  AI Generation failed: ${err.message}`);
        }
    }

    if (!solutionCode || solutionCode.trim().length === 0) {
        log(`  FAILED: No solution could be obtained.`);
        await page.screenshot({ path: `debug-no-solution-${Date.now()}.png` });
        return false;
    }

    // Step 4: Inject code into Ace editor
    log('  Injecting solution code into editor...');
    try {
        await page.evaluate((code) => {
            const textarea = document.getElementById('txtCode');
            if (textarea) {
                if (typeof $ !== 'undefined') {
                    $('#txtCode').val(code);
                } else {
                    textarea.value = code;
                }
            }
            if (typeof txtCode !== 'undefined' && txtCode.getSession) {
                txtCode.getSession().setValue(code);
            }
        }, solutionCode);

        const editorContent = await page.evaluate(() => {
            if (typeof txtCode !== 'undefined' && txtCode.getSession) {
                return txtCode.getSession().getValue();
            }
            return null;
        });

        if (!editorContent || editorContent.trim().length === 0) {
            throw new Error('Editor content is empty after injection');
        }
        log('  Code injected successfully.');
    } catch (err) {
        log(`  Code injection fallback...`);
        await page.evaluate(() => {
            if (typeof txtCode !== 'undefined') txtCode.getSession().setValue('');
        });
        const CHUNK_SIZE = 20;
        for (let i = 0; i < solutionCode.length; i += CHUNK_SIZE) {
            const chunk = solutionCode.slice(i, i + CHUNK_SIZE);
            await page.evaluate((c) => {
                if (typeof txtCode !== 'undefined') txtCode.insert(c);
            }, chunk);
            await sleep(100);
        }
    }

    // Step 5: Click "Run" and check result
    log('  Running the code...');
    try {
        await page.evaluate(() => {
            if (typeof cs === 'function') cs();
        });

        const runBtn = page.locator('button#j_id_bg, button:has-text("Run")').first();
        await runBtn.click();

        await page.waitForFunction(() => {
            const panel = document.querySelector('#progresspanel');
            if (!panel) return false;
            const text = panel.textContent || '';
            return text.includes('SUCCESS') || text.includes('passed') ||
                   text.includes('FAIL') || text.includes('Error') ||
                   text.includes('Compilation');
        }, { timeout: 35000 });

        const result = await page.evaluate(() => {
            const panel = document.querySelector('#progresspanel');
            return panel ? panel.textContent : '';
        });

        if (result.includes('SUCCESS') || result.includes('passed')) {
            log('  ✅ SUCCESS! Passed all test cases.');

            await sleep(1000);
            const proceedBtn = page.locator('button:has-text("Proceed Next")');
            if (await proceedBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
                await Promise.all([
                    proceedBtn.click(),
                    page.waitForNavigation({ waitUntil: 'load', timeout: 30000 }).catch(() => {})
                ]);
                await sleep(1000);
                log('  Proceeded to next.');
                return true;
            }
        } else {
            log(`  ❌ FAILED: ${result.substring(0, 200)}`);
            await page.screenshot({ path: `debug-run-fail-${Date.now()}.png` });
            const backBtn = page.locator('button:has-text("Back To Challenges List")');
            if (await backBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
                await Promise.all([
                    backBtn.click(),
                    page.waitForNavigation({ waitUntil: 'load', timeout: 30000 }).catch(() => {})
                ]);
            }
            return false;
        }
    } catch (err) {
        log(`  Run error: ${err.message}`);
        const backBtn = page.locator('button:has-text("Back To Challenges List")');
        if (await backBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
            await Promise.all([
                backBtn.click(),
                page.waitForNavigation({ waitUntil: 'load', timeout: 30000 }).catch(() => {})
            ]);
        }
        return false;
    }

    return true;
}

function shouldStopGlobally(grandTotal) {
    return grandTotal >= GLOBAL_MAX_SOLVED;
}

// ─── Process all problems on problems list page ───────────────
async function processCurrentPage(page, track) {
    let solvedCount = 0;

    while (true) {
        await sleep(1000);
        const currentButtons = page.locator('#pctbl_content button:has-text("Solve")');
        const count = await currentButtons.count();

        if (count === 0) {
            log('No more unsolved problems on this page.');
            break;
        }

        const problemName = await currentButtons.first().evaluate(btn => {
            const card = btn.closest('.ui-card-content, tr');
            const nameEl = card ? card.querySelector('b, .header') : null;
            return nameEl ? nameEl.textContent.trim() : 'Unknown';
        });

        log(`\n  ── Solving: ${problemName} ──`);

        await Promise.all([
            currentButtons.first().click(),
            page.waitForNavigation({ waitUntil: 'load', timeout: 30000 }).catch(() => {})
        ]);
        await sleep(1000);

        const success = await solveProblem(page, track);
        if (success) {
            solvedCount++;
            if (shouldStopGlobally(track.grandTotalRef.value + solvedCount)) {
                log(`Global limit reached (${GLOBAL_MAX_SOLVED}).`);
                break;
            }
        }

        await page.waitForSelector('#pctbl_content', { timeout: 15000 }).catch(async () => {
            const backBtn = page.locator('button:has-text("Back To Challenges List")');
            if (await backBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
                await Promise.all([
                    backBtn.click(),
                    page.waitForNavigation({ waitUntil: 'load', timeout: 30000 }).catch(() => {})
                ]);
            }
        });

        await sleep(DELAY_BETWEEN_PROBLEMS_MS);
    }

    return solvedCount;
}

async function processAllPages(page, track) {
    let totalSolved = 0;

    while (true) {
        const solved = await processCurrentPage(page, track);
        totalSolved += solved;
        if (shouldStopGlobally(track.grandTotalRef.value + totalSolved)) break;

        const nextPageBtn = page.locator('.ui-paginator-next:not(.ui-state-disabled)').first();
        const hasNext = await nextPageBtn.count() > 0 &&
                        await nextPageBtn.isVisible({ timeout: 3000 }).catch(() => false);

        if (!hasNext) {
            log('No more pages in this set.');
            break;
        }

        log('Navigating to next page...');
        await nextPageBtn.click();
        await sleep(2500);
        await page.waitForSelector('#pctbl_content', { timeout: 10000 }).catch(() => {});
    }

    return totalSolved;
}

// ─── Main Orchestrator ──────────────────────────────────────────
(async () => {
    log(`Starting SkillRack Solver... (Target Languages: ${filterLang.toUpperCase()})`);
    log(`Global Max Solved Limit: ${GLOBAL_MAX_SOLVED}`);

    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();
    page.setDefaultTimeout(35000);

    try {
        await login(page);

        let grandTotal = 0;

        for (const track of TRACKS) {
            if (shouldStopGlobally(grandTotal)) {
                log(`Global limit reached (${GLOBAL_MAX_SOLVED}). Stopping track traversal.`);
                break;
            }

            track.grandTotalRef = { value: grandTotal };

            log(`\n${'═'.repeat(60)}`);
            log(`Starting Track: ${track.name} [${track.language}]`);
            log(`${'═'.repeat(60)}`);

            await track.navigate(page);

            // While there are available View buttons for unsolved parts in this track
            while (true) {
                if (shouldStopGlobally(grandTotal)) break;

                // Check if currently on problems list
                const onProblemsList = await page.locator('#pctbl_content').isVisible({ timeout: 2000 }).catch(() => false);
                const onTutorPage = await page.locator('button#proceedbtn, #txtCodeTbl').isVisible({ timeout: 2000 }).catch(() => false);

                if (!onProblemsList && !onTutorPage) {
                    const currentViewButtons = page.locator('button:has-text("View")');
                    const cCount = await currentViewButtons.count();
                    if (cCount === 0) {
                        log(`  ℹ All available parts in ${track.name} are completed.`);
                        break;
                    }

                    log(`\n${'═'.repeat(60)}`);
                    log(`Processing next available part (out of ${cCount} remaining)...`);
                    log(`${'═'.repeat(60)}`);

                    // Click the first available View button
                    await currentViewButtons.first().click();
                    await page.waitForLoadState('domcontentloaded', { timeout: 25000 }).catch(() => {});
                    await sleep(1500);
                }

                // If on tutor direct problem page
                const nowOnTutor = await page.locator('button#proceedbtn, #codeeditorpanel').isVisible({ timeout: 2000 }).catch(() => false);
                if (nowOnTutor) {
                    const success = await solveProblem(page, track);
                    if (success) grandTotal++;
                } else {
                    // On problems list page
                    const setTotal = await processAllPages(page, track);
                    grandTotal += setTotal;
                }

                track.grandTotalRef.value = grandTotal;

                // Navigate back to track sets page to check next available part
                log(`Navigating back to ${track.name} sets page...`);
                await track.navigate(page);
                await sleep(1500);
            }
        }

        log(`\n${'═'.repeat(60)}`);
        log(`ALL DONE! Total problems solved: ${grandTotal}`);
        log(`${'═'.repeat(60)}`);

    } catch (err) {
        log(`FATAL ERROR: ${err.message}`);
        console.error(err);
        await page.screenshot({ path: `debug-fatal-${Date.now()}.png` });
    } finally {
        await browser.close();
    }
})();


