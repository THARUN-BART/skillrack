require('dotenv').config();
const { chromium } = require('playwright');
const Tesseract = require('tesseract.js');
const readline = require('readline');

// ─── Configuration ──────────────────────────────────────────────
const CAPTCHA_MAX_RETRIES = 5;

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
        // Target the problem description container on the page
        const container = 
            document.querySelector('#programgrid .ui-card-content') ||
            document.querySelector('#programgrid') ||
            document.body;

        const clone = container.cloneNode(true);
        const unwanted = clone.querySelectorAll('script, style, button, img, input, canvas, #txtCodeTbl, #codediv');
        unwanted.forEach(el => el.remove());

        const fullText = (clone.innerText || clone.textContent || '').trim();

        // Window boundary regexes: Start at ProgramID and end at Max Execution Time Limit
        const startRegex = /ProgramID\s*-\s*\d+/i;
        const endRegex = /Max\s*Execution\s*Time\s*(?:Limit)?\s*:\s*\d+\s*(?:millisecs|ms|seconds|secs)?/i;

        const startMatch = fullText.match(startRegex);
        const endMatch = fullText.match(endRegex);

        if (startMatch && endMatch) {
            const startIndex = startMatch.index;
            const endIndex = endMatch.index + endMatch[0].length;
            return fullText.substring(startIndex, endIndex).trim();
        } else if (startMatch) {
            return fullText.substring(startMatch.index).trim();
        }

        return fullText;
    });
}

// Track last API call timestamp to enforce client-side cooldown
let lastApiCallTimestamp = 0;
const MIN_API_COOLDOWN_MS = 2000;

async function generateSolutionWithGemini(problemText, targetLang, prefix = '', suffix = '') {
    const rawApiKey = process.env.GEMINI_API_KEY;
    if (!rawApiKey) {
        throw new Error('GEMINI_API_KEY is not defined in your .env file');
    }

    // Support multiple comma-separated keys if provided (e.g. GEMINI_API_KEY=key1,key2)
    const apiKeys = rawApiKey.split(',').map(k => k.trim()).filter(Boolean);

    // Client-side rate-limit throttling (prevent burst 429s)
    const elapsedSinceLastCall = Date.now() - lastApiCallTimestamp;
    if (elapsedSinceLastCall < MIN_API_COOLDOWN_MS) {
        const waitTime = MIN_API_COOLDOWN_MS - elapsedSinceLastCall;
        await sleep(waitTime);
    }
    lastApiCallTimestamp = Date.now();

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

    // Multi-tier model rotation to distribute quota and avoid single-model 429 limits
    const models = [
        'gemini-3.6-flash',
        'gemini-3.7-flash',
        'gemini-3.5-flash-lite',
        'gemini-3.1-flash-lite',
        'gemini-3.1-pro-preview',
        'gemini-3-flash-preview',
        'gemma-4-31b-it',
        'gemma-4-26b-a4b-it',
        'gemini-3.5-flash',
        'gemini-flash-latest'
    ];

    const maxPasses = 2;
    for (let pass = 1; pass <= maxPasses; pass++) {
        for (const apiKey of apiKeys) {
            for (const model of models) {
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

                    if (response.ok) {
                        const data = await response.json();
                        const candidate = data.candidates?.[0]?.content?.parts?.[0]?.text;
                        if (candidate) {
                            let code = candidate.trim();
                            code = code.replace(/^```[a-zA-Z0-9_+-]*\n?/, '').replace(/\n?```$/, '').trim();
                            log(`  ✓ Generated with model: ${model}`);
                            return code;
                        }
                    }

                    if (response.status === 404) {
                        // Model not available on this endpoint, skip immediately
                        continue;
                    } else if (response.status === 429) {
                        log(`  ⚠️ Model ${model} returned 429 (Rate Limit). Rotating to next model...`);
                        // Brief pause to not hammer endpoint, then try next model
                        await sleep(500);
                        continue;
                    } else if (response.status === 503) {
                        log(`  ⚠️ Model ${model} returned 503 (High Demand). Trying next model...`);
                        continue;
                    } else {
                        const errText = await response.text().catch(() => '');
                        log(`  Warning: Gemini model ${model} returned status ${response.status}: ${errText.substring(0, 120)}`);
                        continue;
                    }
                } catch (err) {
                    log(`  Warning: Request failed with model ${model}: ${err.message}`);
                }
            }
        }

        if (pass < maxPasses) {
            log('⏳ Rate limits active across models. Waiting 5s cooldown before second attempt...');
            await sleep(5000);
        }
    }

    throw new Error('All Gemini models are temporarily rate-limited (429). Please wait a few seconds and try again.');
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

    log(`  Arithmetic line (cleaned): "${cleaned}"`);

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
            log(`  Fallback split: ${a} + ${b} = ${result}`);
            return result;
        }
    }

    throw new Error(`Could not parse arithmetic from: "${arithmeticLine}"`);
}

// ─── Login Helper ───────────────────────────────────────────────
async function loginIfRequired(page) {
    log('Checking login state...');
    await page.goto('https://www.skillrack.com/faces/candidate/codeprogram.xhtml', {
        waitUntil: 'networkidle',
        timeout: 30000
    }).catch(() => {});

    if (await page.locator('input[name="j_username"]').isVisible().catch(() => false)) {
        log('Login form detected. Logging in with credentials from .env...');
        await page.fill('input[name="j_username"]', process.env.SKILLRACK_LOGIN_ID || '');
        await page.fill('input[name="j_password"]', process.env.SKILLRACK_PASSWORD || '');
        
        await Promise.all([
            page.click('input[type="submit"][value="Login"]'),
            page.waitForNavigation({ waitUntil: 'networkidle', timeout: 30000 }).catch(() => {})
        ]);
        log('Login submitted. You are now free to navigate.');
    } else {
        log('Already logged in or ready.');
    }
}

// Concurrency mutex lock to prevent simultaneous calls
let isSolving = false;

// ─── Solve Current Open Problem ─────────────────────────────────
async function handleCurrentProblem(page, options = { autoRun: false, preferredLang: null }) {
    if (isSolving) {
        log('⚠️ A problem solve is already in progress. Please wait for it to finish.');
        return false;
    }

    isSolving = true;
    try {
        log('\n═══════════════════════════════════════════════════');
        log('Detecting and solving current problem...');
        log('═══════════════════════════════════════════════════');

    // 1. Check if captcha is on screen and solve it
    const captchaImg = page.locator('#codeeditorpanel img[src^="data:image"]');
    if (await captchaImg.isVisible({ timeout: 1500 }).catch(() => false)) {
        log('Captcha detected! Solving captcha...');
        let captchaSolved = false;
        for (let attempt = 1; attempt <= CAPTCHA_MAX_RETRIES; attempt++) {
            try {
                const answer = await solveCaptchaFromPage(page);
                await page.fill('input#capval', String(answer));
                await page.click('button#proceedbtn');

                let editorAppeared = false;
                for (let poll = 0; poll < 10; poll++) {
                    await sleep(500);
                    const state = await page.evaluate(() => {
                        const tbl = document.querySelector('#txtCodeTbl');
                        return tbl && tbl.style.display !== 'none';
                    });
                    if (state) { editorAppeared = true; break; }
                }
                if (editorAppeared) {
                    captchaSolved = true;
                    log('✓ Captcha solved successfully.');
                    await sleep(1000);
                    break;
                }
            } catch (err) {
                log(`Captcha attempt ${attempt} error: ${err.message}`);
                await sleep(1000);
            }
        }
        if (!captchaSolved) {
            log('⚠️ Failed to solve captcha automatically. You can solve it manually in the browser.');
        }
    }

    // 2. Detect target language
    let currentLang = await page.evaluate(() => {
        const label = document.querySelector('#langs_label');
        return label ? label.textContent.trim() : '';
    }).catch(() => '');

    let targetLang = options.preferredLang || currentLang || 'C';
    log(`Target Language: ${targetLang} (Current selected on page: "${currentLang || 'None'}")`);

    // If preferredLang is set and different from currentLang, switch it
    if (options.preferredLang && currentLang && !currentLang.includes(options.preferredLang)) {
        try {
            log(`Switching language dropdown to ${options.preferredLang}...`);
            await page.click('#langs_label');
            await sleep(500);
            const langItem = page.locator('#langs_panel li').filter({ hasText: options.preferredLang });
            if (await langItem.count() > 0) {
                await langItem.first().click();
                await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
                await sleep(1500);
            }
        } catch (e) {
            log(`Note on switching language: ${e.message}`);
        }
    }

    // 3. Extract Prefix & Suffix if fill-in-the-blanks
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
    }).catch(() => ({ prefix: '', suffix: '' }));

    if (prefix) log(`  Prefix detected (${prefix.length} chars)`);
    if (suffix) log(`  Suffix detected (${suffix.length} chars)`);

    // 4. Check for pre-existing DOM solution or View Solution button
    let solutionCode = await page.evaluate((lang) => {
        const solnDiv = document.querySelector(`#soln${lang.replace(/\s+/g, '')} pre`);
        if (solnDiv) {
            return (solnDiv.textContent || solnDiv.innerText || '').replace(/\u00a0/g, '').trimEnd();
        }
        return null;
    }, targetLang).catch(() => null);

    if (!solutionCode) {
        // Scrape problem text and generate with Gemini
        log('Extracting question description...');
        const problemText = await extractProblemDetails(page);
        if (!problemText || problemText.length < 10) {
            log('⚠️ Could not extract problem description. Make sure you are on a problem page (#codeeditorpanel).');
            return false;
        }

        log(`Scraped question (${problemText.length} characters).`);
        log('Calling Gemini AI to generate solution...');
        try {
            solutionCode = await generateSolutionWithGemini(problemText, targetLang, prefix, suffix);
            log(`✓ Solution generated by Gemini AI (${solutionCode.length} chars).`);
        } catch (err) {
            log(`❌ Gemini AI Error: ${err.message}`);
            return false;
        }
    } else {
        log(`✓ Found existing solution in DOM (${solutionCode.length} chars).`);
    }

    // 5. Inject solution into Ace Editor
    log('Injecting solution into Ace Editor...');
    try {
        await page.evaluate((code) => {
            const textarea = document.getElementById('txtCode');
            if (textarea) {
                if (typeof $ !== 'undefined') $('#txtCode').val(code);
                else textarea.value = code;
            }
            if (typeof txtCode !== 'undefined' && txtCode.getSession) {
                txtCode.getSession().setValue(code);
            }
        }, solutionCode);

        log('✓ Code successfully placed in editor!');
    } catch (err) {
        log(`❌ Error injecting code: ${err.message}`);
        return false;
    }

    // 6. Optionally Run / Test
    if (options.autoRun) {
        log('Running test cases...');
        try {
            await page.evaluate(() => {
                if (typeof cs === 'function') cs();
            });
            await page.click('button#j_id_bg');

            await page.waitForFunction(() => {
                const panel = document.querySelector('#progresspanel');
                if (!panel) return false;
                const text = panel.textContent || '';
                return text.includes('SUCCESS') || text.includes('passed') ||
                       text.includes('FAIL') || text.includes('Error') ||
                       text.includes('Compilation');
            }, { timeout: 30000 });

            const result = await page.evaluate(() => {
                const panel = document.querySelector('#progresspanel');
                return panel ? panel.textContent.trim() : '';
            });

            if (result.includes('SUCCESS') || result.includes('passed')) {
                log('🎉 Passed all test cases!');
            } else {
                log(`Result: ${result.substring(0, 150)}`);
            }
        } catch (e) {
            log(`Run note: ${e.message}`);
        }
    } else {
        log('ℹ Code is ready in editor. You can review and click "Run" in your browser.');
    }

    return true;
} finally {
    isSolving = false;
}
}

// ─── Main Interactive Runner ────────────────────────────────────
(async () => {
    log('Launching Chrome browser in visible mode...');
    const browser = await chromium.launch({
        headless: false,
        args: ['--start-maximized']
    });
    const context = await browser.newContext({ viewport: null });
    const page = await context.newPage();
    page.setDefaultTimeout(30000);

    // Initial login
    await loginIfRequired(page);

    console.log(`
╔═══════════════════════════════════════════════════════════════════════════════════╗
║                    SKILLRACK MANUAL / ASSISTANT MODE                              ║
╚═══════════════════════════════════════════════════════════════════════════════════╝
  Navigate to ANY problem you want in the opened Chrome window.

  Commands in this terminal:
  • Press [ENTER] or type 's'   -> Automatically solve whatever problem is open!
  • Type 'r'                     -> Solve and auto-run test cases!
  • Type 'watch' or 'w'          -> Toggle auto-watch mode (auto-solves when problem opens)
  • Type 'lang <language>'       -> Set preferred language (e.g. 'lang Python3', 'lang C')
  • Type 'q' or 'exit'           -> Close browser and exit
═══════════════════════════════════════════════════════════════════════════════════
`);

    let autoWatch = false;
    let autoRun = false;
    let preferredLang = null;
    let lastProblemHash = '';

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: 'skillrack> '
    });

    // Auto-watch loop in background
    setInterval(async () => {
        if (!autoWatch || isSolving) return;
        try {
            const hasEditor = await page.evaluate(() => {
                const panel = document.querySelector('#codeeditorpanel');
                const hasImg = !!document.querySelector('#codeeditorpanel img[src^="data:image"]');
                const tbl = document.querySelector('#txtCodeTbl');
                const isTblVis = tbl && tbl.style.display !== 'none';
                return (panel && (hasImg || isTblVis));
            }).catch(() => false);

            if (hasEditor) {
                const currentUrl = page.url();
                const probTextSample = await page.evaluate(() => {
                    const panel = document.querySelector('#codeeditorpanel');
                    return panel ? panel.innerText.substring(0, 100) : '';
                }).catch(() => '');

                const currentHash = `${currentUrl}::${probTextSample}`;
                if (currentHash !== lastProblemHash && probTextSample.length > 5) {
                    lastProblemHash = currentHash;
                    log('\n[Auto-Watch] New problem detected on screen!');
                    await handleCurrentProblem(page, { autoRun, preferredLang });
                    rl.prompt();
                }
            }
        } catch (e) {}
    }, 2000);

    rl.prompt();

    rl.on('line', async (line) => {
        const cmd = line.trim().toLowerCase();

        if (cmd === 'q' || cmd === 'exit') {
            log('Closing browser...');
            await browser.close();
            process.exit(0);
        } else if (cmd === 'watch' || cmd === 'w') {
            autoWatch = !autoWatch;
            log(`Auto-Watch mode is now: ${autoWatch ? 'ENABLED (will auto-solve when you open a problem)' : 'DISABLED'}`);
        } else if (cmd === 'r' || cmd === 'run') {
            await handleCurrentProblem(page, { autoRun: true, preferredLang });
        } else if (cmd.startsWith('lang ')) {
            preferredLang = line.trim().substring(5).trim();
            log(`Preferred language set to: "${preferredLang}"`);
        } else if (cmd === 'help' || cmd === 'h' || cmd === '?') {
            console.log(`Commands:
  [ENTER] / s     - Solve current problem on screen
  r / run         - Solve & run test cases
  watch / w       - Toggle auto-solve watch mode
  lang <language> - Set preferred language (e.g. lang C, lang Python3, lang Java)
  q / exit        - Quit`);
        } else {
            // Default or empty Enter / 's' -> solve current
            await handleCurrentProblem(page, { autoRun, preferredLang });
        }

        rl.prompt();
    });

    // Handle browser closure
    page.on('close', () => {
        log('Browser window was closed.');
        process.exit(0);
    });

})();
