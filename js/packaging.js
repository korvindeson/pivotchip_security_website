/* ===================================
   PACKAGING CONFIGURATOR JAVASCRIPT
   =================================== */

document.addEventListener('DOMContentLoaded', function () {

    const FREQUENCY = [
        { label: 'Weekly', phrase: 'Weekly' },
        { label: 'Monthly', phrase: 'Monthly' },
        { label: 'Every 6 months', phrase: 'Every 6 months' },
        { label: 'Annually', phrase: 'Annually' }
    ];

    const FLEET = [
        { big: 'Under 10 computers', sub: 'single location', usb: 1, net: 1, cmd: 1, dist: 1, multi: false },
        { big: '10\u201325 computers', sub: 'single location', usb: 2, net: 1, cmd: 1, dist: 1, multi: false },
        { big: '25\u201350 computers', sub: 'one or two locations', usb: 3, net: 2, cmd: 1, dist: 1, multi: false },
        { big: '50\u2013100 computers', sub: 'multiple locations', usb: 4, net: 2, cmd: 2, dist: 1, multi: true },
        { big: 'Over 100 computers', sub: 'multiple locations', usb: 6, net: 3, cmd: 2, dist: 2, multi: true }
    ];

    const SUPPORT = {
        self: {
            name: 'Self-Guided',
            includes: [
                'Full device documentation and engagement playbooks',
                'Firmware updates',
                'Automated Security Reporting setup (ATT&CK-mapped reports)'
            ]
        },
        guided: {
            name: 'Guided Operations',
            includes: [
                'Everything in Self-Guided',
                'Technical training sessions for your team',
                'Custom Device Commissioning \u2014 devices armed for your workflows',
                'Firmware customization for your engagement patterns'
            ]
        },
        full: {
            name: 'Full Operational Support',
            includes: [
                'Everything in Guided Operations',
                'Operational support during active engagements',
                'Device Rental Program options \u2014 short-term or long-term',
                'Priority commissioning for new engagements'
            ]
        }
    };

    const REVIEW_OPTIONS = {
        inhouse: 'Yes, in-house',
        lack: 'No, we lack that capability',
        partial: 'Partially / we outsource it'
    };

    const CAP_NAMES = {
        network: 'Network access',
        usb: 'USB access',
        zone: 'Zone monitoring',
        fleet: 'Fleet control',
        training: 'Training routines',
        custom: 'Custom testing routines',
        range: 'Longer range access',
        rfid: 'RFID reader integration',
        live: 'Live engagement support'
    };

    const state = {
        step: 1,
        maxVisited: 1,
        freq: 1,
        fleet: 1,
        multiLocations: false,
        caps: {},
        review: null
    };

    const wizard = document.querySelector('.pkg-wizard');
    if (!wizard) return;

    const progressItems = wizard.querySelectorAll('.pkg-progress-item');
    const progressLines = wizard.querySelectorAll('.pkg-progress-line');
    const steps = wizard.querySelectorAll('.pkg-step');
    const btnBack = document.getElementById('pkg-back');
    const btnNext = document.getElementById('pkg-next');
    const hint = document.getElementById('pkg-hint');
    const multiLocCheckbox = document.getElementById('pkg-multi-loc');

    function renderProgress() {
        progressItems.forEach((item, i) => {
            const stepNo = i + 1;
            item.classList.toggle('current', stepNo === state.step);
            item.classList.toggle('done', stepNo < state.step);
            item.classList.toggle('clickable', stepNo < state.maxVisited && stepNo !== state.step);
        });
        progressLines.forEach((line, i) => {
            line.style.background = (i + 1) < state.step
                ? 'var(--success-color)' : 'var(--border-color)';
        });
    }

    progressItems.forEach((item, i) => {
        item.addEventListener('click', function () {
            const stepNo = i + 1;
            if (stepNo < state.maxVisited && stepNo !== state.step) {
                goToStep(stepNo);
            }
        });
    });

    function goToStep(stepNo, scroll) {
        state.step = stepNo;
        state.maxVisited = Math.max(state.maxVisited, stepNo);

        steps.forEach(s => s.classList.toggle('active', Number(s.dataset.step) === stepNo));
        renderProgress();

        btnBack.style.visibility = stepNo === 1 ? 'hidden' : 'visible';
        btnNext.style.display = stepNo === 5 ? 'none' : 'inline-block';
        btnNext.textContent = stepNo === 4 ? 'Build My Package' : 'Next';
        hint.classList.remove('show');

        if (stepNo === 5) {
            renderResult();
        }

        if (scroll !== false) {
            wizard.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    btnBack.addEventListener('click', function () {
        if (state.step > 1) goToStep(state.step - 1);
    });

    btnNext.addEventListener('click', function () {
        if (state.step === 4 && !state.review) {
            hint.classList.add('show');
            return;
        }
        if (state.step < 5) goToStep(state.step + 1);
    });

    function paintRange(input, labels, index) {
        input.style.setProperty('--fill', (index / Number(input.max)) * 100 + '%');
        input.value = index;
        labels.forEach((lbl, i) => lbl.classList.toggle('on', i === index));
    }

    function triggerFlash(el) {
        el.classList.remove('pkg-flash');
        void el.offsetWidth;
        el.classList.add('pkg-flash');
    }

    const freqInput = document.getElementById('pkg-freq');
    const freqValue = document.getElementById('pkg-freq-value');
    const freqLabels = Array.prototype.slice.call(
        document.querySelectorAll('#pkg-freq-labels span'));

    function paintFreq(animate) {
        paintRange(freqInput, freqLabels, state.freq);
        freqValue.textContent = FREQUENCY[state.freq].label;
        if (animate) triggerFlash(freqValue);
    }

    paintFreq(false);
    freqInput.addEventListener('input', function () {
        state.freq = Number(this.value);
        paintFreq(true);
    });
    freqLabels.forEach((lbl, i) => {
        lbl.addEventListener('click', function () {
            state.freq = i;
            paintFreq(true);
        });
    });

    const fleetInput = document.getElementById('pkg-fleet');
    const fleetValue = document.getElementById('pkg-fleet-value');
    const fleetLabels = Array.prototype.slice.call(
        document.querySelectorAll('#pkg-fleet-labels span'));

    function paintFleet(animate) {
        paintRange(fleetInput, fleetLabels, state.fleet);
        const f = FLEET[state.fleet];
        const subText = state.multiLocations ? 'multiple locations (selected)' : f.sub;
        fleetValue.innerHTML = f.big + '<small>' + subText + '</small>';
        if (animate) triggerFlash(fleetValue);
    }

    paintFleet(false);
    fleetInput.addEventListener('input', function () {
        state.fleet = Number(this.value);
        paintFleet(true);
    });
    fleetLabels.forEach((lbl, i) => {
        lbl.addEventListener('click', function () {
            state.fleet = i;
            paintFleet(true);
        });
    });

    if (multiLocCheckbox) {
        multiLocCheckbox.addEventListener('change', function () {
            state.multiLocations = this.checked;
            paintFleet(true);
        });
    }

    // Step 3 Capability Checkboxes & Full Card Click Support
    // e.preventDefault() stops the browser's native label->input click
    // forwarding, which otherwise fires on top of the manual toggle below
    // and makes checkboxes toggle twice per click (net effect: no change).
    wizard.querySelectorAll('.pkg-checks-rows .pkg-check').forEach(card => {
        const input = card.querySelector('input[type="checkbox"]');
        if (!input) return;

        card.addEventListener('click', function (e) {
            if (e.target.tagName === 'A') return;
            e.preventDefault();
            if (e.target !== input) {
                input.checked = !input.checked;
                input.dispatchEvent(new Event('change'));
            }
        });

        input.addEventListener('change', function () {
            const cap = this.dataset.cap;
            if (this.checked) {
                state.caps[cap] = true;
            } else {
                delete state.caps[cap];
            }
            card.classList.toggle('selected', this.checked);
        });
    });

    // Step 4 Source Code Review Radios & Full Card Click Support
    // preventDefault(): see the Step 3 note - without it the native label
    // forwarding fires alongside the manual selection below.
    wizard.querySelectorAll('.pkg-radio').forEach(card => {
        const input = card.querySelector('input[type="radio"]');
        if (!input) return;

        card.addEventListener('click', function (e) {
            if (e.target.tagName === 'A') return;
            e.preventDefault();
            if (e.target !== input) {
                input.checked = true;
                input.dispatchEvent(new Event('change'));
            }
        });

        input.addEventListener('change', function () {
            state.review = this.value;
            wizard.querySelectorAll('.pkg-radio').forEach(c => {
                c.classList.toggle('selected', c.contains(this));
            });
            hint.classList.remove('show');
        });
    });

    function computePackage() {
        const f = { ...FLEET[state.fleet] };
        if (state.multiLocations) {
            f.multi = true;
            f.sub = 'multiple locations';
            if (f.cmd < 2) f.cmd = 2;
        }

        const devices = [];
        const addons = [];
        const notes = [];

        let usbWhy = 'Endpoint takeover from any USB port: automatic OS detection, '
            + 'live two-way command & control, one-command pentest survey and evidence-grade reporting.';
        if (state.caps.zone) {
            usbWhy += ' Runs passive presence monitoring — classifies people and devices as new, known, regular or returning.';
        }
        if (state.caps.training) {
            usbWhy += ' Carries the training routines: overt or discreet mode, activity recording and fake "ransomware" response drills.';
        }
        if (state.caps.custom) {
            usbWhy += ' Runs any terminal command or software you choose on the remote machine.';
        }
        devices.push({
            name: 'USB Drive Module',
            href: 'pentesting-devices.html#usb-drive-module',
            count: f.usb,
            why: usbWhy
        });

        const networkIn = state.caps.network || state.caps.custom;
        if (networkIn) {
            devices.push({
                name: 'Network Module',
                href: 'pentesting-devices.html#network-module',
                count: f.net,
                why: 'Executes all responder-class man-in-the-middle attacks from any network port: '
                    + 'credential harvesting, asset discovery and protocol analysis.'
            });
        }

        const distIn = state.caps.range || f.multi;
        if (distIn) {
            devices.push({
                name: 'Long Distance Module',
                href: 'pentesting-devices.html#long-distance-module',
                count: f.dist,
                why: 'An invisible cable over Wi-Fi HaLow: command & control up to 1 km line of sight '
                    + '(300–500 m urban), plus relay points for multi-site coordination.'
            });
        }

        const deviceTypes = 1 + (networkIn ? 1 : 0) + (distIn ? 1 : 0);
        if (state.caps.fleet || state.caps.zone || deviceTypes >= 2 || f.usb >= 4 || f.multi) {
            devices.push({
                name: 'Command Module',
                href: 'pentesting-devices.html#command-module',
                count: f.multi ? f.cmd : 1,
                why: 'The central hub: pairs and relays commands across devices, live status and credential '
                    + 'monitoring, and one merged ATT&CK-mapped report.'
                    + (f.multi ? ' One per location.' : '')
            });
        }

        if (state.caps.custom) {
            addons.push({
                text: '<strong>Keyboard Pass-Through Module</strong> — inline keystroke capture between '
                    + 'keyboard and computer, useful for detection-validation and training runs.',
                href: 'pentesting-devices.html#keyboard-module',
                link: 'Module details'
            });
        }
        if (state.caps.training) {
            addons.push({
                text: '<strong>Custom shell variant</strong> — an overt shell with LCD status screen and red '
                    + 'indicator light raises discovery chance and worry level; discreet shells cover covert runs.',
                href: 'service-custom-shells.html',
                link: 'Custom Device Shells'
            });
        }
        if (state.caps.rfid) {
            addons.push({
                text: '<strong>RFID reader integration</strong> — Custom Device Commissioning pairs the kit '
                    + 'with your badge readers and joins physical access events with engagement data.',
                href: 'service-red-teaming.html',
                link: 'Commissioning details'
            });
        }
        if (state.caps.custom && state.review === 'inhouse') {
            addons.push({
                text: '<strong>Scankit Burp Bridge</strong> — scans the source, resolves routes and loads '
                    + 'them into Burp Suite Pro as a ready-to-attack starting point.',
                href: 'burp-bridge-flow.html',
                link: 'How the Bridge works'
            });
        }

        let tier = 'self';
        if (state.freq <= 1 || state.fleet >= 2 || state.caps.training
            || state.caps.rfid || state.caps.custom || f.multi) {
            tier = 'guided';
        }
        if (state.caps.live || (state.freq === 0 && state.fleet >= 3)) {
            tier = 'full';
        }

        let scanKit = null;
        if (state.review === 'inhouse') {
            scanKit = {
                mode: 'included in your package',
                text: 'ScanKit scans your source (9 languages, 310+ detectors), deploys the application to the '
                    + 'test environment, runs active tests and automated AI triage, and hands your researchers '
                    + 'a unified, offline review report.'
            };
        } else if (state.review === 'lack') {
            scanKit = {
                mode: 'recommended add-on',
                text: 'ScanKit onboarding: we deploy the pipeline (scan → deploy → active tests → AI triage '
                    + '→ report) and train your team, so source-code review becomes an in-house capability.'
            };
        } else if (state.review === 'partial') {
            scanKit = {
                mode: 'optional add-on',
                text: 'ScanKit lets you bring outsourced reviews in-house: scan, deploy, active tests, '
                    + 'automated AI triage and AI-assisted review in one pipeline.'
            };
        }

        if (state.freq >= 2) {
            notes.push('With projects every ' + FREQUENCY[state.freq].phrase.toLowerCase()
                + ', the Device Rental Program (short-term or long-term rental with full technical support) '
                + 'may fit better than purchasing — devices are armed per engagement and reused.');
        } else if (state.freq === 0) {
            notes.push('With weekly projects, owning your kit or a long-term rental keeps devices armed and '
                + 'ready between engagements.');
        }
        if (state.caps.live) {
            notes.push('Live engagement support is included: an engineer is available during active engagements '
                + 'for device, payload and troubleshooting help.');
        }

        const total = devices.reduce((sum, d) => sum + d.count, 0);
        let tierName;
        if (total <= 2 && !f.multi) {
            tierName = 'Traveler Kit';
        } else if (total <= 6) {
            tierName = 'Starter Kit';
        } else if (total <= 10) {
            tierName = 'Engagement Kit';
        } else {
            tierName = 'Fleet Kit';
        }

        return { tierName, devices, addons, tier, scanKit, notes, fleet: f };
    }

    function esc(s) {
        return s.replace(/&(?!(amp|lt|gt|quot|#\d+);)/g, '&amp;')
            .replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function renderResult() {
        const pkg = computePackage();
        const support = SUPPORT[pkg.tier];
        const freqPhrase = FREQUENCY[state.freq].phrase;
        const capsList = Object.keys(state.caps);
        const capsText = capsList.length
            ? capsList.map(c => CAP_NAMES[c]).join(', ')
            : 'none selected';

        const container = document.getElementById('pkg-result');

        let html = '';
        html += '<div class="pkg-result-head">';
        html += '<span class="pkg-result-badge">' + pkg.tierName + '</span>';
        html += '<p class="pkg-result-for">Recommended for ' + esc(freqPhrase.toLowerCase())
            + ' physical testing &middot; ' + esc(pkg.fleet.big.toLowerCase())
            + ', ' + esc(pkg.fleet.sub) + '</p>';
        html += '</div>';

        html += '<div class="pkg-result-grid">';
        html += '<div class="pkg-dev-list">';
        html += '<h3>Recommended devices</h3>';
        pkg.devices.forEach(d => {
            html += '<div class="pkg-dev-item">';
            html += '<div class="pkg-dev-count">' + d.count + '<small>&times;</small></div>';
            html += '<div><h4><a href="' + d.href + '" target="_blank" rel="noopener">' + d.name + '</a></h4>';
            html += '<p>' + d.why + '</p></div>';
            html += '</div>';
        });
        html += '</div>';

        html += '<div class="pkg-side">';
        html += '<div class="pkg-support-box">';
        html += '<h4>Support: ' + support.name + '</h4>';
        html += '<ul>' + support.includes.map(i => '<li>' + i + '</li>').join('') + '</ul>';
        html += '</div>';

        if (pkg.scanKit) {
            html += '<div class="pkg-addon-box">';
            html += '<h4>ScanKit \u2014 ' + pkg.scanKit.mode + '</h4>';
            html += '<p style="font-size: var(--font-size-small); color: var(--text-secondary); margin: 0;">'
                + pkg.scanKit.text
                + ' <a href="scankit.html" target="_blank" rel="noopener">About ScanKit</a></p>';
            html += '</div>';
        }

        if (pkg.addons.length) {
            html += '<div class="pkg-addon-box">';
            html += '<h4>Optional add-ons</h4>';
            html += '<ul>' + pkg.addons.map(a =>
                '<li>' + a.text
                + ' <a href="' + a.href + '" target="_blank" rel="noopener">' + a.link + '</a></li>'
            ).join('') + '</ul>';
            html += '</div>';
        }

        pkg.notes.forEach(n => {
            html += '<p class="pkg-note">' + n + '</p>';
        });

        html += '</div></div>';

        const summary =
            'Packaging request (from pivotchip.ca/packaging.html):\n'
            + '- Physical testing frequency: ' + freqPhrase + '\n'
            + '- Client fleet size: ' + pkg.fleet.big + ', ' + pkg.fleet.sub + '\n'
            + '- Capabilities needed: ' + capsText + '\n'
            + '- Source code review: ' + (state.review ? REVIEW_OPTIONS[state.review] : 'Not specified') + '\n'
            + '- Recommended package: ' + pkg.tierName + ' \u2014 '
                + pkg.devices.map(d => d.count + ' \u00d7 ' + d.name).join(', ') + '\n'
            + '- Support level: ' + support.name + '\n'
            + (pkg.scanKit ? '- ScanKit: ' + pkg.scanKit.mode + '\n' : '');
        sessionStorage.setItem('pkg-result', summary);
        const contactUrl = 'contact.html?service=device-package&kit=' + encodeURIComponent(summary);

        html += '<div class="pkg-ctas">';
        html += '<a href="' + contactUrl + '" class="btn btn-primary">Request This Package</a>';
        html += '<a href="pentesting-devices.html" class="btn btn-secondary">Browse Devices</a>';
        html += '<a href="use-cases.html" class="btn btn-outline">See Use Cases</a>';
        html += '</div>';

        html += '<p class="pkg-summary">Your answers: ' + esc(freqPhrase) + ' testing &middot; '
            + esc(pkg.fleet.big) + ' (' + esc(pkg.fleet.sub) + ') &middot; capabilities: '
            + esc(capsText) + ' &middot; source code review: '
            + esc(state.review ? REVIEW_OPTIONS[state.review].toLowerCase() : 'none')
            + '. Use the progress bar above to adjust any answer.</p>';

        html += '<p class="pkg-ethics">All packages are provided for authorized security assessments only '
            + '\u2014 see our <a href="ethical-use-policy.html">Ethical Use Policy</a>.</p>';

        container.innerHTML = html;
    }

    paintFreq(false);
    paintFleet(false);
    goToStep(1, false);
});