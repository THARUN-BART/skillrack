require('dotenv').config();
const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    console.log('Navigating to SkillRack...');
    await page.goto('https://www.skillrack.com/faces/candidate/codeprogram.xhtml');

    // Check if we are on the login page
    if (await page.locator('input[name="j_username"]').isVisible()) {
        console.log('Login page detected. Logging in...');
        await page.fill('input[name="j_username"]', process.env.SKILLRACK_LOGIN_ID);
        await page.fill('input[name="j_password"]', process.env.SKILLRACK_PASSWORD);
        
        await Promise.all([
            page.click('input[type="submit"][value="Login"]'),
            page.waitForNavigation({ waitUntil: 'networkidle', timeout: 60000 }).catch(() => {})
        ]);

        const logoutVisible = await page.locator('a:has-text("Logout"):visible').count()
            .then(c => c > 0).catch(() => false);
        const homeVisible = await page.locator('a:has-text("Home"):visible').count()
            .then(c => c > 0).catch(() => false);
        const profileVisible = await page.locator('a:has-text("Profile"):visible').count()
            .then(c => c > 0).catch(() => false);
        const stillOnLoginForm = await page.locator('input[name="j_username"]')
            .isVisible({ timeout: 3000 }).catch(() => false);

        if (logoutVisible || (homeVisible && profileVisible) || !stillOnLoginForm) {
            console.log('Login successful.');
        } else {
            console.log('Login failed. Saving screenshot...');
            await page.screenshot({ path: 'login-failure.png' });
            await browser.close();
            process.exit(1);
        }
    } else {
        console.log('Already logged in or on a different page.');
    }

    // Navigate to the specific CodeTrack Level 2 page
    const targetUrl = 'https://www.skillrack.com/faces/candidate/codeprogramgroup.xhtml?gt=CODETRACK&lev=2';
    console.log(`Navigating to: ${targetUrl}`);
    await page.goto(targetUrl, { waitUntil: 'networkidle' });
    
    // Click on the "Show" button for "KICKSTART for ABSOLUTE Beginner"
    console.log('Looking for "Show" button for KICKSTART...');
    const kickstartRow = page.locator('div.ui-card-content', { hasText: /KICKSTART/i });
    const showButton = kickstartRow.locator('button').filter({ hasText: 'Show' });
    
    if (await showButton.count() > 0 && await showButton.first().isVisible({ timeout: 10000 }).catch(() => false)) {
        console.log('Clicking "Show" button...');
        await Promise.all([
            showButton.first().click(),
            page.waitForNavigation({ waitUntil: 'load' }).catch(() => {})
        ]);
        console.log('Navigated after clicking first Show.');
    } else {
        console.log('Could not find the "Show" button for KICKSTART.');
        await page.screenshot({ path: 'debug-show-button-1.png' });
    }

    // Second click: "KICKSTART (Code Solution)"
    console.log('Looking for "Show" button for KICKSTART (Code Solution)...');
    const solutionRow = page.locator('div.ui-card-content', { hasText: /KICKSTART \(Code Solution\)/i });
    const solutionShowButton = solutionRow.locator('button').filter({ hasText: 'Show' });

    if (await solutionShowButton.count() > 0 && await solutionShowButton.first().isVisible({ timeout: 10000 }).catch(() => false)) {
        console.log('Clicking second "Show" button...');
        await Promise.all([
            solutionShowButton.first().click(),
            page.waitForNavigation({ waitUntil: 'load' }).catch(() => {})
        ]);
        console.log('Navigated after clicking second Show.');
    } else {
        console.log('Could not find the "Show" button for KICKSTART (Code Solution).');
        await page.screenshot({ path: 'debug-show-button-2.png' });
    }

    console.log('Final URL:', page.url());
    console.log('Ready to solve problems.');

    // Closing for now as requested
    await browser.close();
})();
