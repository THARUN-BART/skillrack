require('dotenv').config();
const { chromium } = require('playwright');
const Tesseract = require('tesseract.js');

// ─── Configuration ──────────────────────────────────────────────
const DELAY_BETWEEN_PROBLEMS_MS = 2000;
const CAPTCHA_MAX_RETRIES = 5;
const GLOBAL_MAX_SOLVED = 50;

function createCodeTutorTrack(nameRegex, displayName, prefix = 'PART') {
    return {
        name: displayName,
        partsCount: 0,
        prefix: prefix,
        language: 'C',
        languageCode: '1',
        startUrl: 'https://www.skillrack.com/faces/candidate/codeprogramgroup.xhtml?gt=CODETUTOR',
        navigate: async (page) => {
            await page.goto('https://www.skillrack.com/faces/candidate/codeprogramgroup.xhtml?gt=CODETUTOR', { waitUntil: 'networkidle', timeout: 30000 });
            await sleep(1000);

            // Click "Show" for C Programming
            const showBtn1 = page.locator('div.ui-card-content', { hasText: /C Programming/i })
                .locator('button:has-text("Show")').first();
            if (await showBtn1.isVisible({ timeout: 5000 }).catch(() => false)) {
                await showBtn1.click();
                await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
                await sleep(1000);
            }

            // Click "Show" for specific track
            const showBtn2 = page.locator('table.padtbl', { hasText: nameRegex })
                .locator('button:has-text("Show")').first();
            if (await showBtn2.isVisible({ timeout: 5000 }).catch(() => false)) {
                await showBtn2.click();
                await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
                await sleep(1000);
            }
        }
    };
}

const TRACKS = [
    {
        name: 'KICKSTART',
        partsCount: 3,
        prefix: 'SET',
        language: 'Python3',
        languageCode: '7',
        startUrl: 'https://www.skillrack.com/faces/candidate/codeprogramgroup.xhtml?gt=CODETRACK&lev=2',
        navigate: async (page) => {
            await page.goto('https://www.skillrack.com/faces/candidate/codeprogramgroup.xhtml?gt=CODETRACK&lev=2', { waitUntil: 'networkidle', timeout: 30000 });
            await sleep(1000);

            // Click "Show" for KICKSTART for ABSOLUTE Beginner
            const showBtn1 = page.locator('div.ui-card-content', { hasText: /KICKSTART/i })
                .locator('button:has-text("Show")').first();
            if (await showBtn1.isVisible({ timeout: 5000 }).catch(() => false)) {
                await showBtn1.click();
                await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
                await sleep(1000);
            }

            // Click "Show" for KICKSTART (Code Solution)
            const showBtn2 = page.locator('div.ui-card-content', { hasText: /KICKSTART \(Code Solution\)/i })
                .locator('button:has-text("Show")').first();
            if (await showBtn2.isVisible({ timeout: 5000 }).catch(() => false)) {
                await showBtn2.click();
                await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
                await sleep(1000);
            }
        }
    },
    createCodeTutorTrack(/C - INTRO \(Code Solution\)/i, 'C - INTRO (Code Solution)'),
    createCodeTutorTrack(/C - INPUT\/OUTPUT \(Video Explanation\)/i, 'C - INPUT/OUTPUT (Video Explanation)'),
    createCodeTutorTrack(/C - ARITHMETIC OPERATORS \(Video Explanation\)/i, 'C - ARITHMETIC OPERATORS (Video Explanation)'),
    createCodeTutorTrack(/C - IF ELSE \(Video Explanation\)/i, 'C - IF ELSE (Video Explanation)'),
    createCodeTutorTrack(/C - NESTED IF ELSE \(Video Explanation\)/i, 'C - NESTED IF ELSE (Video Explanation)'),
    createCodeTutorTrack(/C - NESTED LOOPS AND PATTERNS \(Video Explanation\)/i, 'C - NESTED LOOPS AND PATTERNS (Video Explanation)'),
    createCodeTutorTrack(/C - ARRAY \(Video Explanation\)/i, 'C - ARRAY (Video Explanation)'),
    createCodeTutorTrack(/C - STRING \(Video Explanation\)/i, 'C - STRING (Video Explanation)'),
    createCodeTutorTrack(/C - MATRIX \(Video Explanation\)/i, 'C - MATRIX (Video Explanation)'),
    createCodeTutorTrack(/C -\s*50 VERY-EASY CHALLENGES/i, 'C - 50 VERY-EASY CHALLENGES')
];

// ─── Utility helpers ────────────────────────────────────────────
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function log(msg) {
    const ts = new Date().toLocaleTimeString();
    console.log(`[${ts}] ${msg}`);
}

// ─── Captcha solver ─────────────────────────────────────────────
// Renders the captcha in the browser via canvas at 4x scale, takes a Playwright
// screenshot of the canvas, then sends to tesseract with a character whitelist.
async function solveCaptchaFromPage(page) {
    // Use the browser to render the captcha onto a canvas at 4x scale
    // This gives us a clean, crisp, properly-rendered image
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
        // White background so tesseract has clean borders around the dark image
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // Disable smoothing for crisp pixel-perfect scaling
        ctx.imageSmoothingEnabled = false;
        // Draw the captcha image scaled up — keep original colors (dark bg, light text)
        // Do NOT invert: inversion was distorting digit shapes causing 5→2 etc.
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        document.body.appendChild(canvas);
    });

    // Take a Playwright screenshot of the rendered canvas
    const canvasEl = page.locator('#__captcha_canvas__');
    const screenshotBuffer = await canvasEl.screenshot();

    // Remove the canvas from the DOM
    await page.evaluate(() => {
        const c = document.getElementById('__captcha_canvas__');
        if (c) c.remove();
    });

    // tesseract.js v4: parameters go in the 4th argument as key-value pairs
    const { data: { text } } = await Tesseract.recognize(screenshotBuffer, 'eng', {
        logger: () => {},
    }, {
        tessedit_char_whitelist: '0123456789+=',
        tessedit_pageseg_mode: '6', // PSM 6: single uniform block of text
    });

    log(`  Captcha OCR raw text: "${text.trim()}"`);

    // Find the arithmetic line — last line always has the expression
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    let arithmeticLine = null;

    // Priority 1: line with both + and =
    for (const line of lines) {
        if (line.includes('+') && line.includes('=')) { arithmeticLine = line; break; }
    }
    // Priority 2: last line containing =
    if (!arithmeticLine) {
        for (let i = lines.length - 1; i >= 0; i--) {
            if (lines[i].includes('=')) { arithmeticLine = lines[i]; break; }
        }
    }

    if (!arithmeticLine) {
        throw new Error(`Could not find arithmetic line. Lines: ${JSON.stringify(lines)}`);
    }

    log(`  Arithmetic line (raw): "${arithmeticLine}"`);

    // Clean confirmed character confusions for this captcha font
    let cleaned = arithmeticLine;
    cleaned = cleaned.replace(/[FBSbs]/g, '8'); // 8 → reads as F, B, or S in this font
    cleaned = cleaned.replace(/[lI|!]/g, '1');  // 1 → reads as l, I, |, !
    cleaned = cleaned.replace(/[Oo]/g, '0');    // 0 → reads as O or o
    cleaned = cleaned.replace(/[^0-9+=]/g, ''); // strip everything else

    log(`  Arithmetic line (cleaned): "${cleaned}"`);

    // Standard parse: "81+7="
    let match = cleaned.match(/(\d+)\+(\d+)=/);
    if (match) {
        const a = parseInt(match[1], 10);
        const b = parseInt(match[2], 10);
        // Captcha numbers are always 1–99; >99 means characters were merged by OCR
        if (a <= 99 && b <= 99) {
            log(`  Captcha: ${a} + ${b} = ${a + b}`);
            return a + b;
        }
        log(`  Parsed ${a}+${b} but numbers >99, likely merged — trying brute-force split`);
    }

    // Fallback: the '+' was misread as a digit or lost entirely
    // We have something like "0947=" which is actually "09+7=" or "94+7="
    // Try all possible split positions for "digits="
    const digitsBeforeEquals = cleaned.replace('=', '');
    log(`  No '+' found. Trying brute-force split on: "${digitsBeforeEquals}"`);

    // The captcha format is A+B= where A and B are 1-2 digit numbers (1-99)
    for (let splitPos = 1; splitPos < digitsBeforeEquals.length; splitPos++) {
        const aStr = digitsBeforeEquals.substring(0, splitPos);
        const bStr = digitsBeforeEquals.substring(splitPos);
        const a = parseInt(aStr, 10);
        const b = parseInt(bStr, 10);

        // Both numbers should be reasonable (1-99 for a simple captcha)
        if (a >= 1 && a <= 99 && b >= 1 && b <= 99) {
            const result = a + b;
            log(`  Brute-force split: ${a} + ${b} = ${result} (split at pos ${splitPos})`);
            return result;
        }
    }

    throw new Error(`Could not parse arithmetic from: "${arithmeticLine}" (cleaned: "${cleaned}")`);
}

// ─── Login ──────────────────────────────────────────────────────
async function login(page) {
    log('Navigating to SkillRack...');
    await page.goto('https://www.skillrack.com/faces/candidate/codeprogram.xhtml', {
        waitUntil: 'networkidle',
        timeout: 60000
    });

    if (await page.locator('input[name="j_username"]').isVisible().catch(() => false)) {
        log('Login page detected. Logging in...');
        await page.fill('input[name="j_username"]', process.env.SKILLRACK_LOGIN_ID);
        await page.fill('input[name="j_password"]', process.env.SKILLRACK_PASSWORD);

        await Promise.all([
            page.click('input[type="submit"][value="Login"]'),
            page.waitForNavigation({ waitUntil: 'networkidle', timeout: 60000 }).catch(() => {})
        ]);

        // Some pages render multiple matching links (including hidden ones),
        // so we confirm login with a few visible markers.
        const logoutVisible = await page.locator('a:has-text("Logout"):visible').count()
            .then(c => c > 0).catch(() => false);
        const homeVisible = await page.locator('a:has-text("Home"):visible').count()
            .then(c => c > 0).catch(() => false);
        const profileVisible = await page.locator('a:has-text("Profile"):visible').count()
            .then(c => c > 0).catch(() => false);
        const stillOnLoginForm = await page.locator('input[name="j_username"]')
            .isVisible({ timeout: 3000 }).catch(() => false);

        if (!logoutVisible && !(homeVisible && profileVisible) && stillOnLoginForm) {
            await page.screenshot({ path: 'debug-login-failure.png' });
            throw new Error('Login failed');
        }
        log('Login successful.');
    } else {
        log('Already logged in.');
    }
}

// Navigation is now handled by track objects

// ─── Solve a single problem on the solve page ───────────────────
async function solveProblem(page, track) {
    // Step 1: Solve captcha
    log('  Solving captcha...');
    let captchaSolved = false;

    for (let attempt = 1; attempt <= CAPTCHA_MAX_RETRIES; attempt++) {
        try {
            // Check if captcha is present (look for the captcha image)
            const hasCaptchaImg = await page.locator('#codeeditorpanel img[src^="data:image"]').count();

            if (hasCaptchaImg === 0) {
                // Maybe captcha was already solved or not needed
                const editorVisible = await page.locator('#txtCodeTbl').isVisible({ timeout: 3000 }).catch(() => false);
                if (editorVisible) {
                    log('  Editor already visible, captcha may not be needed.');
                    captchaSolved = true;
                    break;
                }
                throw new Error('Captcha image not found');
            }

            const answer = await solveCaptchaFromPage(page);

            // Fill the captcha input
            await page.fill('input#capval', String(answer));

            // Click "Proceed to Solve the Program"
            await page.click('button#proceedbtn');

            // Fast detection: poll every 500ms for up to 8s.
            // Detect SUCCESS (editor appeared) OR FAILURE (captcha still showing) quickly.
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
                    // Captcha still showing after ~1s — wrong answer, fail fast
                    throw new Error('Wrong captcha answer (captcha form still visible)');
                }
            }
            if (!editorAppeared) throw new Error('Editor did not appear after captcha submit');

            // Brief pause for Ace editor scripts to initialize
            await sleep(1500);

            captchaSolved = true;
            log('  Captcha solved successfully.');
            break;
        } catch (err) {
            log(`  Captcha attempt ${attempt} failed: ${err.message}`);
            if (attempt < CAPTCHA_MAX_RETRIES) {
                // Go back to the problems list — this forces a fresh page load
                // with a NEW captcha image when we re-enter the problem.
                // page.reload() keeps the same captcha, so we must navigate away.
                log('  Going back to problems list for a fresh captcha...');
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

                // Re-click the Solve button for this problem
                // (it should still be at the top of the list since it's unsolved)
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

    // Step 2: Change language to target lang via UI click on PrimeFaces dropdown
    log(`  Changing language to ${track.language}...`);
    try {
        // Check if already target language or if language dropdown is not present (e.g. fixed language)
        const currentLang = await page.evaluate(() => {
            const label = document.querySelector('#langs_label');
            return label ? label.textContent.trim() : '';
        });

        if (currentLang === '') {
            log('  No language dropdown found. Assuming default language is already set.');
        } else if (currentLang.includes(track.language)) {
            log(`  Already set to ${track.language}.`);
        } else {
            // Click the dropdown label to open it
            await page.click('#langs_label');
            await sleep(500);

            // Wait for the dropdown panel to appear and click the target language
            const langItem = page.locator('#langs_panel li').filter({ hasText: track.language });
            if (await langItem.count() > 0) {
                await langItem.first().click();
            } else {
                // Fallback: try clicking by text directly in the panel
                await page.click(`#langs_panel >> text=${track.language}`);
            }

            // Wait for AJAX to complete — the editor panel refreshes
            await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
            await sleep(2000);

            // Verify
            const newLang = await page.evaluate(() => {
                const label = document.querySelector('#langs_label');
                return label ? label.textContent.trim() : '';
            });
            log(`  Language is now: ${newLang}`);
        }
    } catch (err) {
        log(`  Warning: Language change via UI failed: ${err.message}`);
        // Last resort: force it programmatically and trigger change
        try {
            await page.evaluate((code) => {
                const sel = document.getElementById('langs_input');
                if (sel) {
                    sel.value = code;
                    sel.dispatchEvent(new Event('change', { bubbles: true }));
                }
            }, track.languageCode);
            await sleep(3000);
            log('  Forced language change via dispatchEvent.');
        } catch (e) {
            log(`  All language change methods failed: ${e.message}`);
        }
    }

    // Step 3: Extract target language solution from DOM (it's hidden but present)
    log(`  Extracting ${track.language} solution...`);
    let solutionCode = await page.evaluate((lang) => {
        // First try to get from the hidden solution div
        // The ID is usually 'soln' + Language (e.g. solnPython3, solnC)
        const solnDivId = `#soln${lang.replace(/\s+/g, '')} pre`;
        const solnDiv = document.querySelector(solnDivId);
        if (solnDiv) {
            // Get text content and clean it
            let text = solnDiv.textContent || solnDiv.innerText || '';
            // Remove &nbsp; (non-breaking spaces at the end)
            text = text.replace(/\u00a0/g, '').trimEnd();
            return text;
        }
        return null;
    }, track.language);

    if (!solutionCode) {
        // Fallback: Click "View Solution" then the language to make it visible
        log('  Solution not in DOM, trying to click View Solution...');
        try {
            await page.click('#showbtn');
            await sleep(500);
            // Click language button
            await page.evaluate((lang) => {
                if (typeof showHideSoln === 'function') showHideSoln(lang);
            }, track.language);
            await sleep(500);

            solutionCode = await page.evaluate((lang) => {
                const solnDivId = `#soln${lang.replace(/\s+/g, '')} pre`;
                const solnDiv = document.querySelector(solnDivId);
                if (solnDiv) {
                    let text = solnDiv.textContent || solnDiv.innerText || '';
                    text = text.replace(/\u00a0/g, '').trimEnd();
                    return text;
                }
                return null;
            }, track.language);
        } catch (e) {
            log(`  View Solution click failed: ${e.message}`);
        }
    }

    if (!solutionCode || solutionCode.trim().length === 0) {
        log(`  FAILED: Could not extract ${track.language} solution.`);
        await page.screenshot({ path: `debug-no-solution-${Date.now()}.png` });
        return false;
    }

    // Step 3b: Handle "Fill in the blanks" by extracting prefix and suffix from the problem page
    log('  Checking for prefix/suffix (fill-in-the-blanks mode)...');
    const { prefix, suffix } = await page.evaluate(() => {
        let pref = '', suff = '';
        const codediv = document.getElementById('codediv');
        if (codediv) {
            // Find all <pre> elements inside .ui-outputpanel inside #codediv
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

    if (prefix || suffix) {
        log(`  Found prefix (${prefix.length} chars) and/or suffix (${suffix.length} chars). Stripping from solution...`);
        // We do a robust fuzzy match to find the boundaries
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
        
        log(`  Blank code extracted (${solutionCode.length} chars).`);
    } else {
        log(`  No prefix/suffix found. Using full solution.`);
    }

    log(`  Ready to inject (${solutionCode.length} chars).`);

    // Step 4: Inject code into the Ace editor using DOM replacement approach
    // Strategy: Set the hidden textarea value FIRST, then call setValue() on Ace.
    // The change handler compares Ace value vs textarea value — since both match, diff=0 → passes guard.
    log('  Injecting solution code into editor...');
    try {
        await page.evaluate((code) => {
            // 1. Set the hidden textarea to our code
            const textarea = document.getElementById('txtCode');
            if (textarea) {
                // Use jQuery if available (PrimeFaces pages have jQuery)
                if (typeof $ !== 'undefined') {
                    $('#txtCode').val(code);
                } else {
                    textarea.value = code;
                }
            }

            // 2. Set the Ace editor to the same code — change handler will see diff=0
            if (typeof txtCode !== 'undefined' && txtCode.getSession) {
                txtCode.getSession().setValue(code);
            }
        }, solutionCode);

        // Verify the code was set
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
        log(`  Code injection failed: ${err.message}. Trying chunk approach...`);
        // Fallback: type code character by character via Ace API
        await page.evaluate(() => {
            if (typeof txtCode !== 'undefined') {
                txtCode.getSession().setValue('');
            }
        });
        // Type in small chunks
        const CHUNK_SIZE = 20;
        for (let i = 0; i < solutionCode.length; i += CHUNK_SIZE) {
            const chunk = solutionCode.slice(i, i + CHUNK_SIZE);
            await page.evaluate((c) => {
                if (typeof txtCode !== 'undefined') {
                    txtCode.insert(c);
                }
            }, chunk);
            await sleep(100);
        }
        // Sync textarea
        await page.evaluate(() => {
            if (typeof txtCode !== 'undefined' && typeof $ !== 'undefined') {
                $('#txtCode').val(txtCode.getSession().getValue());
            }
        });
    }

    // Step 5: Click "Run" and wait for result
    log('  Running the code...');
    try {
        // Ensure cs() sync happens first (called by the Run button's onclick)
        await page.evaluate(() => {
            if (typeof cs === 'function') cs();
        });

        await page.click('button#j_id_bg');

        // Wait for progress panel to show result
        await page.waitForFunction(() => {
            const panel = document.querySelector('#progresspanel');
            if (!panel) return false;
            const text = panel.textContent || '';
            return text.includes('SUCCESS') || text.includes('passed') ||
                   text.includes('FAIL') || text.includes('Error') ||
                   text.includes('Compilation');
        }, { timeout: 30000 });

        // Check result
        const result = await page.evaluate(() => {
            const panel = document.querySelector('#progresspanel');
            return panel ? panel.textContent : '';
        });

        if (result.includes('SUCCESS') || result.includes('passed')) {
            log('  ✅ SUCCESS! Code passed all test cases.');

            // Step 6: Click "Proceed Next"
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
            // Go back to challenges list to continue
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
        await page.screenshot({ path: `debug-run-error-${Date.now()}.png` });
        // Try to go back
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

// ─── Process all problems in current problems list page ─────────
async function processCurrentPage(page, track) {
    let solvedCount = 0;

    // Get all problem cards with "Solve" buttons on this page
    const solveButtons = page.locator('#pctbl_content button:has-text("Solve")');
    let buttonCount = await solveButtons.count();
    log(`Found ${buttonCount} unsolved problem(s) on current page.`);

    // We process problems one at a time. After solving one, "Proceed Next" brings us
    // back to the list. The solved problem may disappear, so we re-scan each time.
    while (true) {
        // Re-scan for available Solve buttons on the current page
        await sleep(1000);
        const currentButtons = page.locator('#pctbl_content button:has-text("Solve")');
        const count = await currentButtons.count();

        if (count === 0) {
            log('No more unsolved problems on this page.');
            break;
        }

        // Get the problem name for logging
        const problemName = await currentButtons.first().evaluate(btn => {
            const card = btn.closest('.ui-card-content');
            const nameEl = card ? card.querySelector('b') : null;
            return nameEl ? nameEl.textContent.trim() : 'Unknown';
        });

        log(`\n  ── Solving: ${problemName} ──`);

        // Click the first Solve button
        await Promise.all([
            currentButtons.first().click(),
            page.waitForNavigation({ waitUntil: 'load', timeout: 30000 }).catch(() => {})
        ]);
        await sleep(1000);

        // Now on the solve problem page — solve it
        const success = await solveProblem(page, track);
        if (success) {
            solvedCount++;
            if (shouldStopGlobally(track.grandTotalRef.value + solvedCount)) {
                log(`Global limit reached (${GLOBAL_MAX_SOLVED}). Stopping further solves.`);
                break;
            }
        }

        // After "Proceed Next" or "Back to Challenges List", we should be back on the problems list
        // Verify we're on the problems list
        await page.waitForSelector('#pctbl_content', { timeout: 15000 }).catch(async () => {
            log('  Not on problems list after solving. Trying to navigate back...');
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

// ─── Process all pages of a set's problems list ─────────────────
async function processAllPages(page, track) {
    let totalSolved = 0;

    while (true) {
        // Process current page
        const solved = await processCurrentPage(page, track);
        totalSolved += solved;
        if (shouldStopGlobally(track.grandTotalRef.value + totalSolved)) {
            log(`Global limit reached (${GLOBAL_MAX_SOLVED}). Stopping page traversal.`);
            break;
        }

        // Check if there's a next page
        const nextPageBtn = page.locator('.ui-paginator-next:not(.ui-state-disabled)').first();
        const hasNext = await nextPageBtn.count() > 0 &&
                        await nextPageBtn.isVisible({ timeout: 3000 }).catch(() => false);

        if (!hasNext) {
            log('No more pages in this set.');
            break;
        }

        log('Navigating to next page...');
        await nextPageBtn.click();
        // PrimeFaces paginator typically does an AJAX update, not full navigation
        await sleep(3000);
        // Wait for the content to update
        await page.waitForSelector('#pctbl_content', { timeout: 10000 }).catch(() => {});
    }

    return totalSolved;
}

// ─── Main orchestrator ──────────────────────────────────────────
(async () => {
    const browser = await chromium.launch({ headless: false }); // visible for monitoring
    const context = await browser.newContext();
    const page = await context.newPage();

    // Set longer default timeout
    page.setDefaultTimeout(30000);

    try {
        // 1. Login
        await login(page);

        // 2. Iterate through all tracks
        let grandTotal = 0;

        for (const track of TRACKS) {
            if (shouldStopGlobally(grandTotal)) {
                log(`Global limit reached (${GLOBAL_MAX_SOLVED}). Stopping track traversal.`);
                break;
            }

            track.grandTotalRef = { value: grandTotal };

            log(`\n${'═'.repeat(60)}`);
            log(`Starting Track: ${track.name}`);
            log(`${'═'.repeat(60)}`);

            await track.navigate(page);

            for (let setIndex = 0; setIndex < (track.partsCount || 999); setIndex++) {
                if (shouldStopGlobally(grandTotal)) {
                    log(`Global limit reached (${GLOBAL_MAX_SOLVED}). Stopping set traversal.`);
                    break;
                }

                log(`\n${'═'.repeat(60)}`);
                log(`Processing ${track.prefix}${String(setIndex + 1).padStart(3, '0')}...`);
                log(`${'═'.repeat(60)}`);

                // Check if we're already on a problems list
                const alreadyOnProblemsList = await page.locator('#pctbl_content')
                    .isVisible({ timeout: 2000 }).catch(() => false);

                if (!alreadyOnProblemsList) {
                    // Try to click "View"
                    let clicked = false;

                    const viewById = page.locator(`button[id="cttbl:${setIndex}:j_id_4u"]`);
                    if (await viewById.isVisible({ timeout: 3000 }).catch(() => false)) {
                        await viewById.click();
                        await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
                        await sleep(1500);
                        clicked = true;
                    }

                    if (!clicked) {
                        const setNum = String(setIndex + 1).padStart(3, '0');
                        const setCard = page.locator('.ui-card-content', {
                            hasText: new RegExp(`${track.prefix}${setNum}`, 'i')
                        });
                        const viewBtn = setCard.locator('button:has-text("View")').first();
                        if (await viewBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
                            await viewBtn.click();
                            await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
                            await sleep(1500);
                            clicked = true;
                        }
                    }

                    if (!clicked) {
                        log(`  ⚠️  Could not find View button for ${track.prefix}${setIndex + 1}. Taking screenshot...`);
                        await page.screenshot({ path: `debug-no-view-${track.prefix}${setIndex + 1}.png` });
                        if (!track.partsCount) {
                            log(`  No partsCount specified, assuming we've reached the end of ${track.name}.`);
                            break;
                        } else {
                            log(`  Skipping ${track.prefix}${setIndex + 1}.`);
                            continue;
                        }
                    }
                } else {
                    log(`  Already on problems list. Processing directly.`);
                }

                // Process all pages of problems in this set
                const setTotal = await processAllPages(page, track);
                grandTotal += setTotal;
                track.grandTotalRef.value = grandTotal;
                log(`\n${track.prefix}${String(setIndex + 1).padStart(3, '0')} complete. Solved: ${setTotal}`);

                if (shouldStopGlobally(grandTotal)) {
                    log(`Global limit reached (${GLOBAL_MAX_SOLVED}). Ending run.`);
                    break;
                }

                // Navigate back for the next set
                if (!track.partsCount || setIndex < track.partsCount - 1) {
                    log(`Navigating back to ${track.name} sets page...`);
                    await track.navigate(page);
                    log(`  Sets page ready for ${track.prefix}${String(setIndex + 2).padStart(3, '0')}.`);
                }
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
