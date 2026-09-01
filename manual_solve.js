require('dotenv').config();
const { chromium } = require('playwright');
const Tesseract = require('tesseract.js');
const readline = require('readline');

// ─── Configuration ──────────────────────────────────────────────
const CAPTCHA_MAX_RETRIES = 5;
const MAX_DEBUG_RETRIES = 3;
const MIN_API_COOLDOWN_MS = 2000;

// Track last API call timestamp to enforce client-side cooldown
let lastApiCallTimestamp = 0;
let isSolving = false;

// ─── Utility helpers ────────────────────────────────────────────
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function log(msg) {
    const ts = new Date().toLocaleTimeString();
    console.log(`[${ts}] ${msg}`);
}

function cleanLanguageName(rawLang) {
    if (!rawLang) return 'C';
    const lang = rawLang.trim();
    if (/python/i.test(lang)) return 'Python3';
    if (/c\+\+/i.test(lang) || /cpp/i.test(lang)) return 'C++';
    if (/^c\b/i.test(lang) || /^c\s*\(/i.test(lang)) return 'C';
    if (/java\b/i.test(lang)) return 'Java';
    if (/javascript|node/i.test(lang)) return 'JavaScript';
    return lang.replace(/\s*\([^)]*\)/g, '').trim();
}

function extractCleanCode(rawText) {
    if (!rawText) return '';
    let text = rawText.trim();

    // 1. Match code inside markdown block ```lang ... ```
    const codeBlockMatch = text.match(/```[^\r\n]*\r?\n([\s\S]*?)```/);
    if (codeBlockMatch) {
        text = codeBlockMatch[1];
    } else {
        // Fallback: strip leading/trailing backticks
        text = text.replace(/^```[^\r\n]*\r?\n?/, '').replace(/\r?\n?```$/, '');
    }

    text = text.trim();

    // 2. Extra safety: Check if Line 1 is an accidental language label (e.g. "Python3 (3.12)", "Python", "C", "C++", "Java")
    const lines = text.split(/\r?\n/);
    if (lines.length > 1) {
        const firstLine = lines[0].trim();
        if (/^(?:python\d*|c\+\+\d*|cpp\d*|c|java|javascript|node)(?:\s*\([^)]*\))?$/i.test(firstLine)) {
            lines.shift();
            text = lines.join('\n').trim();
        }
    }

    return text;
}

// ─── Gemini AI Solver & Debugger ────────────────────────────────
async function extractProblemDetails(page) {
    return await page.evaluate(() => {
        const container = 
            document.querySelector('#programgrid .ui-card-content') ||
            document.querySelector('#programgrid') ||
            document.querySelector('#codeeditorpanel') ||
            document.body;

        const clone = container.cloneNode(true);
        const unwanted = clone.querySelectorAll('script, style, button, img, input, canvas, #txtCodeTbl, #codediv');
        unwanted.forEach(el => el.remove());

        const fullText = (clone.innerText || clone.textContent || '').trim();

        // Optional boundary trimming if formatted with standard markers
        const startRegex = /ProgramID\s*-\s*\d+/i;
        const endRegex = /Max\s*Execution\s*Time\s*(?:Limit)?\s*:\s*\d+\s*(?:millisecs|ms|seconds|secs)?/i;

        const startMatch = fullText.match(startRegex);
        const endMatch = fullText.match(endRegex);

        if (startMatch && endMatch && startMatch.index < endMatch.index) {
            const startIndex = startMatch.index;
            const endIndex = endMatch.index + endMatch[0].length;
            return fullText.substring(startIndex, endIndex).trim();
        } else if (startMatch) {
            return fullText.substring(startMatch.index).trim();
        }

        return fullText;
    });
}

async function callGeminiApi(systemInstruction, userPrompt) {
    const rawApiKey = process.env.GEMINI_API_KEY;
    if (!rawApiKey) {
        throw new Error('GEMINI_API_KEY is not defined in your .env file');
    }

    const apiKeys = rawApiKey.split(',').map(k => k.trim()).filter(Boolean);

    // Enforce cooldown
    const elapsedSinceLastCall = Date.now() - lastApiCallTimestamp;
    if (elapsedSinceLastCall < MIN_API_COOLDOWN_MS) {
        const waitTime = MIN_API_COOLDOWN_MS - elapsedSinceLastCall;
        await sleep(waitTime);
    }
    lastApiCallTimestamp = Date.now();

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
                            maxOutputTokens: 4096,
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
                            const cleanCode = extractCleanCode(candidate);
                            log(`  ✓ Generated with model: ${model} (${cleanCode.split('\n').length} lines)`);
                            return cleanCode;
                        }
                    }

                    if (response.status === 404) {
                        continue;
                    } else if (response.status === 429) {
                        log(`  ⚠️ Model ${model} returned 429 (Rate Limit). Rotating model...`);
                        await sleep(500);
                        continue;
                    } else if (response.status === 503) {
                        log(`  ⚠️ Model ${model} returned 503 (High Demand). Trying next model...`);
                        continue;
                    } else {
                        const errText = await response.text().catch(() => '');
                        log(`  Warning: Gemini model ${model} status ${response.status}: ${errText.substring(0, 100)}`);
                        continue;
                    }
                } catch (err) {
                    log(`  Warning: Request failed with model ${model}: ${err.message}`);
                }
            }
        }

        if (pass < maxPasses) {
            log('⏳ Rate limit active across models. Waiting 5s cooldown before second attempt...');
            await sleep(5000);
        }
    }

    throw new Error('All Gemini models are temporarily busy or rate-limited. Please retry shortly.');
}

async function generateSolutionWithGemini(problemText, targetLang, prefix = '', suffix = '') {
    const systemInstruction = `You are an expert competitive programmer. 
Your task is to write clean, correct, bug-free code in ${targetLang} to solve the given coding challenge.
CRITICAL RULES:
1. Return ONLY the executable code inside a markdown code block (\`\`\`${targetLang} ... \`\`\`).
2. Do NOT include any conversational text, explanations, or commentary.
3. Strictly read input from stdin and write output to stdout.
4. Cover all boundary conditions and edge cases.
5. If Prefix or Suffix code is provided, output ONLY the missing code snippet that fits in between.`;

    const userPrompt = `Problem Description:
${problemText}

Target Language: ${targetLang}
${prefix ? `\nPrefix Code (already present, do NOT repeat):\n${prefix}\n` : ''}
${suffix ? `\nSuffix Code (already present, do NOT repeat):\n${suffix}\n` : ''}
`;

    return await callGeminiApi(systemInstruction, userPrompt);
}

async function debugSolutionWithGemini(problemText, targetLang, currentCode, executionError, prefix = '', suffix = '') {
    const systemInstruction = `You are an expert competitive programmer and code debugger.
The provided ${targetLang} solution failed on SkillRack with errors or wrong test outputs.
Your task is to analyze the problem, the failing code, and the error logs, fix ALL bugs, and return the complete corrected code.

CRITICAL RULES:
1. Return ONLY the executable corrected code inside a markdown code block (\`\`\`${targetLang} ... \`\`\`).
2. Do NOT include explanations, markdown notes, or commentary.
3. Strictly read input from stdin and write output to stdout.
4. Fix edge cases, off-by-one errors, formatting issues, and data type overflow.
5. If Prefix or Suffix code is present, return ONLY the code that fills the gap between them.`;

    const userPrompt = `Problem Description:
${problemText}

Target Language: ${targetLang}
${prefix ? `\nPrefix Code (already present, do NOT repeat):\n${prefix}\n` : ''}
${suffix ? `\nSuffix Code (already present, do NOT repeat):\n${suffix}\n` : ''}

Currently Failing Code:
\`\`\`${targetLang}
${currentCode}
\`\`\`

Execution / Test Result Output from SkillRack:
${executionError}

Please provide the completely corrected and working code.`;

    return await callGeminiApi(systemInstruction, userPrompt);
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

// ─── Ace Editor Code Injector ───────────────────────────────────
async function injectCodeToPage(page, code) {
    return await page.evaluate((codeToInject) => {
        // 1. Set the hidden textarea
        const textarea = document.getElementById('txtCode');
        if (textarea) {
            textarea.value = codeToInject;
            if (typeof $ !== 'undefined') {
                $('#txtCode').val(codeToInject).trigger('input').trigger('change');
            }
        }

        // 2. Set Ace Editor via global txtCode
        if (typeof txtCode !== 'undefined') {
            if (typeof txtCode.setValue === 'function') {
                txtCode.setValue(codeToInject, -1);
            } else if (txtCode.getSession && typeof txtCode.getSession().setValue === 'function') {
                txtCode.getSession().setValue(codeToInject);
            }
            if (typeof txtCode.clearSelection === 'function') {
                txtCode.clearSelection();
            }
        }

        // 3. Check for any ace editor in DOM
        const aceEl = document.querySelector('.ace_editor');
        if (aceEl && aceEl.env && aceEl.env.editor) {
            aceEl.env.editor.setValue(codeToInject, -1);
            aceEl.env.editor.clearSelection();
        }

        // 4. Trigger cs() sync function if present
        if (typeof cs === 'function') {
            try { cs(); } catch (e) {}
        }

        // 5. Read back current value in editor to verify
        let editorVal = '';
        if (typeof txtCode !== 'undefined' && txtCode.getValue) {
            editorVal = txtCode.getValue();
        } else if (aceEl && aceEl.env && aceEl.env.editor) {
            editorVal = aceEl.env.editor.getValue();
        } else if (textarea) {
            editorVal = textarea.value;
        }

        return {
            lines: editorVal ? editorVal.split('\n').length : 0,
            length: editorVal ? editorVal.length : 0,
            content: editorVal
        };
    }, code);
}

// ─── Test Runner & AI Auto-Debugger ─────────────────────────────
async function runAndAutoDebug(page, problemText, targetLang, prefix, suffix, maxRetries = MAX_DEBUG_RETRIES) {
    log('\n🚀 Running code and verifying test cases on SkillRack...');

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        // Trigger cs() sync before clicking Run
        await page.evaluate(() => {
            if (typeof cs === 'function') {
                try { cs(); } catch (e) {}
            }
        });

        const runBtn = page.locator('button#j_id_bg, button:has-text("Run")').first();
        if (await runBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
            await runBtn.click();
        } else {
            await page.click('button#j_id_bg');
        }

        log('  Waiting for test case execution...');
        await page.waitForFunction(() => {
            const panel = document.querySelector('#progresspanel');
            if (!panel) return false;
            const text = panel.textContent || '';
            return text.includes('SUCCESS') || text.includes('passed') ||
                   text.includes('FAIL') || text.includes('Error') ||
                   text.includes('Compilation') || text.includes('Wrong');
        }, { timeout: 35000 }).catch(() => {});

        const result = await page.evaluate(() => {
            const panel = document.querySelector('#progresspanel');
            if (!panel) return '';
            return (panel.innerText || panel.textContent || '').trim();
        });

        if (result.includes('SUCCESS') || result.includes('passed') || result.includes('All test cases passed')) {
            log('\n🎉 ✅ ALL TEST CASES PASSED! Problem solved successfully.');
            return true;
        }

        log(`\n❌ Test Execution Failed (Attempt ${attempt + 1}/${maxRetries + 1}):`);
        log(`--------------------------------------------------`);
        log(result.substring(0, 300));
        log(`--------------------------------------------------`);

        if (attempt < maxRetries) {
            // Read currently failing code from editor
            const currentCode = await page.evaluate(() => {
                if (typeof txtCode !== 'undefined' && txtCode.getValue) return txtCode.getValue();
                const textarea = document.getElementById('txtCode');
                return textarea ? textarea.value : '';
            });

            log(`🤖 Asking Gemini AI to analyze the failure & debug the code...`);
            try {
                const fixedCode = await debugSolutionWithGemini(
                    problemText,
                    targetLang,
                    currentCode,
                    result,
                    prefix,
                    suffix
                );

                const injectStats = await injectCodeToPage(page, fixedCode);
                log(`✓ Injected debugged code (${injectStats.lines} lines, ${injectStats.length} chars). Retesting...`);
                await sleep(1500);
            } catch (err) {
                log(`⚠️ Auto-debug generation failed: ${err.message}`);
                break;
            }
        } else {
            log('⚠️ Maximum debug attempts reached. You can review the code in the editor.');
        }
    }

    return false;
}

// ─── Solve Current Open Problem ─────────────────────────────────
async function handleCurrentProblem(page, options = { autoRun: false, preferredLang: null, lastCodeHolder: null }) {
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

        let rawLang = options.preferredLang || currentLang || 'C';
        let targetLang = cleanLanguageName(rawLang);
        log(`Target Language: ${targetLang} (Detected from page: "${currentLang || 'None'}")`);

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

        // 4. Scrape problem text
        log('Extracting question description...');
        const problemText = await extractProblemDetails(page);
        if (!problemText || problemText.length < 10) {
            log('⚠️ Could not extract problem description. Make sure you are on a problem page (#codeeditorpanel).');
            return false;
        }
        log(`Scraped question (${problemText.length} characters).`);

        // 5. Generate solution with Gemini AI
        log('Calling Gemini AI to generate solution...');
        let solutionCode = '';
        try {
            solutionCode = await generateSolutionWithGemini(problemText, targetLang, prefix, suffix);
        } catch (err) {
            log(`❌ Gemini AI Error: ${err.message}`);
            return false;
        }

        if (!solutionCode || solutionCode.trim().length === 0) {
            log('❌ No code was generated.');
            return false;
        }

        if (options.lastCodeHolder) {
            options.lastCodeHolder.code = solutionCode;
            options.lastCodeHolder.problemText = problemText;
            options.lastCodeHolder.targetLang = targetLang;
            options.lastCodeHolder.prefix = prefix;
            options.lastCodeHolder.suffix = suffix;
        }

        // 6. Inject solution into Ace Editor
        log('Injecting solution into Ace Editor...');
        const injectStats = await injectCodeToPage(page, solutionCode);
        log(`✓ Successfully placed ${injectStats.lines} lines (${injectStats.length} characters) into editor!`);

        // 7. Auto-Run & Auto-Debug if requested
        if (options.autoRun) {
            await runAndAutoDebug(page, problemText, targetLang, prefix, suffix);
        } else {
            log('ℹ Code is ready in editor. Type "r" to run & auto-debug, or "p" to preview full code in terminal.');
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
║               SKILLRACK ASSISTANT + GEMINI AI DEBUGGER                            ║
╚═══════════════════════════════════════════════════════════════════════════════════╝
  Navigate to ANY problem you want in the opened Chrome window.

  Commands in this terminal:
  • [ENTER] or 's'        -> Solve and place full code in editor
  • 'r' or 'run'          -> Solve, inject, run tests & AUTO-DEBUG with Gemini on failure!
  • 'd' or 'debug'        -> Analyze current editor error & auto-debug with Gemini!
  • 'p' or 'print'        -> Print full generated code in this terminal
  • 'watch' or 'w'        -> Toggle auto-solve mode when opening any problem
  • 'lang <language>'     -> Set preferred language (e.g. 'lang Python3', 'lang C')
  • 'q' or 'exit'         -> Close browser and exit
═══════════════════════════════════════════════════════════════════════════════════
`);

    let autoWatch = false;
    let autoRun = false;
    let preferredLang = null;
    let lastProblemHash = '';
    const lastCodeHolder = { code: '', problemText: '', targetLang: '', prefix: '', suffix: '' };

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
                    await handleCurrentProblem(page, { autoRun, preferredLang, lastCodeHolder });
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
            log(`Auto-Watch mode is now: ${autoWatch ? 'ENABLED (auto-solves when problem opens)' : 'DISABLED'}`);
        } else if (cmd === 'r' || cmd === 'run') {
            await handleCurrentProblem(page, { autoRun: true, preferredLang, lastCodeHolder });
        } else if (cmd === 'd' || cmd === 'debug') {
            log('\n🔍 Manual Debug Triggered: Reading problem & error from page...');
            const problemText = await extractProblemDetails(page);
            const currentLang = await page.evaluate(() => {
                const label = document.querySelector('#langs_label');
                return label ? label.textContent.trim() : '';
            }).catch(() => '');
            const targetLang = cleanLanguageName(preferredLang || currentLang || 'C');
            await runAndAutoDebug(page, problemText, targetLang, lastCodeHolder.prefix, lastCodeHolder.suffix);
        } else if (cmd === 'p' || cmd === 'print' || cmd === 'show') {
            if (lastCodeHolder.code) {
                console.log('\n────────── FULL GENERATED CODE ──────────');
                console.log(lastCodeHolder.code);
                console.log('─────────────────────────────────────────\n');
            } else {
                log('No code generated yet. Press Enter or type "s" to solve first.');
            }
        } else if (cmd.startsWith('lang ')) {
            preferredLang = line.trim().substring(5).trim();
            log(`Preferred language set to: "${preferredLang}"`);
        } else if (cmd === 'help' || cmd === 'h' || cmd === '?') {
            console.log(`Commands:
  [ENTER] / s     - Solve current problem on screen
  r / run         - Solve, inject & AUTO-DEBUG with Gemini until all tests pass
  d / debug       - Re-run and debug current code with Gemini
  p / print       - Show full generated code in this terminal
  watch / w       - Toggle auto-solve watch mode
  lang <language> - Set preferred language (e.g. lang C, lang Python3, lang Java)
  q / exit        - Quit`);
        } else {
            await handleCurrentProblem(page, { autoRun: false, preferredLang, lastCodeHolder });
        }

        rl.prompt();
    });

    // Handle browser closure
    page.on('close', () => {
        log('Browser window was closed.');
        process.exit(0);
    });

})();
