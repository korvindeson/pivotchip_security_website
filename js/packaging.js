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
        { big: 'Under 10 computers', sub: 'single location', usb: 1, net: 1, cmd: 1, dist: 1 },
        { big: '10\u201325 computers', sub: 'single location', usb: 2, net: 1, cmd: 1, dist: 1 },
        { big: '25\u201350 computers', sub: 'one or two locations', usb: 3, net: 2, cmd: 1, dist: 1 },
        { big: '50\u2013100 computers', sub: '', usb: 4, net: 2, cmd: 1, dist: 1 },
        { big: 'Over 100 computers', sub: '', usb: 6, net: 3, cmd: 1, dist: 1 }
    ];

    const SUPPORT = {
        self: {
            name: 'Self-Guided',
            includes: [
                'Device documentation and playbooks',
                'Firmware updates',
                'Automated reporting setup (ATT&CK mapped)'
            ]
        },
        guided: {
            name: 'Guided Operations',
            includes: [
                'Everything in Self-Guided',
                'Team training sessions',
                'Custom device commissioning',
                'Firmware customization'
            ]
        },
        full: {
            name: 'Full Operational Support',
            includes: [
                'Everything in Guided Operations',
                'Support during active engagements',
                'Short or long term device rental',
                'Priority commissioning'
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
        const subText = state.multiLocations ? 'multiple locations' : f.sub;
        fleetValue.innerHTML = f.big + (subText ? '<small>' + subText + '</small>' : '');
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
            if (f.dist < 2) f.dist = 2;
        }

        const devices = [];
        const addons = [];
        const notes = [];

        let usbWhy = 'Endpoint takeover from any USB port: OS detection, two-way '
            + 'command and control, pentest survey, evidence-grade reports.';
        if (state.caps.zone) {
            usbWhy += ' Passive monitoring classifies people and devices as new, known, regular or returning.';
        }
        if (state.caps.training) {
            usbWhy += ' Runs training modes: obvious or discreet, activity recording, fake ransomware drills.';
        }
        if (state.caps.custom) {
            usbWhy += ' Runs any command or software on the remote machine.';
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
                why: 'Runs man-in-the-middle attacks from any network port: credential '
                    + 'harvesting, asset discovery, protocol analysis.'
            });
        }

        const distIn = state.caps.range || f.multi;
        if (distIn) {
            devices.push({
                name: 'Long Distance Module',
                href: 'pentesting-devices.html#long-distance-module',
                count: f.dist,
                why: 'Wi-Fi HaLow link: control up to 1 km line of sight (300-500 m urban), '
                    + 'relays for multi-site work.'
            });
        }

        const deviceTypes = 1 + (networkIn ? 1 : 0) + (distIn ? 1 : 0);
        if (state.caps.fleet || state.caps.zone || deviceTypes >= 2 || f.usb >= 4 || f.multi) {
            devices.push({
                name: 'Command Module',
                href: 'pentesting-devices.html#command-module',
                count: f.multi ? f.cmd : 1,
                why: 'Central hub: relays commands, live status, credential monitoring, '
                    + 'one merged ATT&CK-mapped report.' + (f.multi ? ' One per location.' : '')
            });
        }

        if (state.caps.custom) {
            addons.push({
                text: '<strong>Keyboard Pass-Through Module</strong>, inline keystroke capture for '
                    + 'detection validation and training runs.',
                href: 'pentesting-devices.html#keyboard-module',
                link: 'Module details'
            });
        }
        if (state.caps.training) {
            addons.push({
                text: '<strong>Custom shell variant</strong>, overt shell with LCD screen and red light '
                    + 'raises detection chance. Discreet shells for covert runs.',
                href: 'service-custom-shells.html',
                link: 'Custom Device Shells'
            });
        }
        if (state.caps.rfid) {
            addons.push({
                text: '<strong>RFID reader integration</strong>, commissioning pairs the kit with your '
                    + 'badge readers.',
                href: 'service-red-teaming.html',
                link: 'Commissioning details'
            });
        }
        if (state.caps.custom && state.review === 'inhouse') {
            addons.push({
                text: '<strong>Scankit Burp Bridge</strong>, loads scanned routes into Burp Suite Pro '
                    + 'as a starting point.',
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
                text: 'Scans 9 languages with 310+ detectors, deploys the app, runs active tests '
                    + 'and AI triage, and produces one review report.'
            };
        } else if (state.review === 'lack') {
            scanKit = {
                mode: 'recommended add-on',
                text: 'We deploy the pipeline (scan, deploy, test, triage, report) and train '
                    + 'your team to review source code in-house.'
            };
        } else if (state.review === 'partial') {
            scanKit = {
                mode: 'optional add-on',
                text: 'Brings outsourced reviews in-house: one pipeline for scan, deploy, test and triage.'
            };
        }

        if (state.freq >= 2) {
            notes.push('At this frequency, renting may beat buying. Devices are armed per '
                + 'engagement and reused.');
        } else if (state.freq === 0) {
            notes.push('With weekly projects, owning the kit or a long-term rental keeps devices ready.');
        }
        if (state.caps.live) {
            notes.push('Live engagement support included: an engineer on call during engagements.');
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
        const reviewShort = state.review ? REVIEW_OPTIONS[state.review] : 'not specified';
        const fleetLine = pkg.fleet.sub
            ? pkg.fleet.big + ', ' + pkg.fleet.sub
            : pkg.fleet.big;

        const DEVICE_META = {
            'USB Drive Module': { img: 'images/devices/usb-drive-icon.png', tag: 'Core module' },
            'Network Module': { img: 'images/devices/network-module-icon.png', tag: 'Network testing' },
            'Command Module': { img: 'images/devices/command-module-icon.png', tag: 'Coordination hub' },
            'Long Distance Module': { img: 'images/devices/long-distance-icon.png', tag: 'Extended range' }
        };

        function attrEsc(s) {
            return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;')
                .replace(/</g, '&lt;').replace(/>/g, '&gt;');
        }

        const container = document.getElementById('pkg-result');

        // ---- Header: badge + configuration receipt ---------------------
        let html = '';
        html += '<div class="pkg-result-head">';
        html += '<span class="pkg-result-badge">' + pkg.tierName + '</span>';
        html += '<p class="pkg-result-for">Recommended for ' + esc(freqPhrase.toLowerCase())
            + ' testing &middot; ' + esc(fleetLine) + '</p>';
        html += '<div class="pkg-config-chips">';
        html += '<span class="pkg-chip">' + esc(FREQUENCY[state.freq].label) + ' projects</span>';
        html += '<span class="pkg-chip">' + esc(fleetLine) + '</span>';
        html += '<span class="pkg-chip">' + esc(capsText) + '</span>';
        html += '<span class="pkg-chip">Source code review: ' + esc(reviewShort) + '</span>';
        html += '</div></div>';

        // ---- Device manifest -------------------------------------------
        html += '<div class="pkg-sec">';
        html += '<div class="pkg-sec-label">Devices in your kit</div>';
        html += '<div class="pkg-manifest">';
        pkg.devices.forEach(d => {
            const meta = DEVICE_META[d.name] || {};
            html += '<div class="pkg-manifest-row">';
            html += '<img class="pkg-thumb" src="' + (meta.img || 'images/assets/logo.png')
                + '" alt="' + d.name + '">';
            html += '<div class="pkg-manifest-main">';
            html += '<div class="pkg-manifest-title">';
            html += '<span class="pkg-dev-count">' + d.count + '&times;</span>';
            html += '<h4><a href="' + d.href + '" target="_blank" rel="noopener">' + d.name + '</a></h4>';
            html += '<span class="pkg-chip">' + (meta.tag || 'Module') + '</span>';
            html += '</div>';
            html += '<p>' + d.why + '</p>';
            html += '</div></div>';
        });
        html += '</div></div>';

        // ---- Support plan ----------------------------------------------
        html += '<div class="pkg-sec">';
        html += '<div class="pkg-sec-label">Support plan</div>';
        html += '<div class="pkg-support-card">';
        html += '<div class="pkg-support-name">' + support.name
            + ' <span class="pkg-chip pkg-chip-green">Selected</span></div>';
        html += '<ul class="pkg-support-list">'
            + support.includes.map(i => '<li>' + i + '</li>').join('') + '</ul>';
        html += '</div></div>';

        // ---- Options & add-ons -----------------------------------------
        if (pkg.scanKit || pkg.addons.length || pkg.notes.length) {
            html += '<div class="pkg-sec">';
            html += '<div class="pkg-sec-label">Options &amp; add-ons</div>';

            if (pkg.scanKit) {
                const chipCls = state.review === 'inhouse' ? ' pkg-chip-green'
                    : (state.review === 'lack' ? ' pkg-chip-accent' : '');
                const chipLabel = state.review === 'inhouse' ? 'Included'
                    : (state.review === 'lack' ? 'Recommended' : 'Optional');
                html += '<div class="pkg-option-row">';
                html += '<span class="pkg-chip' + chipCls + '">' + chipLabel + '</span>';
                html += '<div class="pkg-option-body"><strong>ScanKit</strong> &mdash; '
                    + pkg.scanKit.text
                    + ' <a href="scankit.html" target="_blank" rel="noopener">About ScanKit</a></div>';
                html += '</div>';
            }

            pkg.addons.forEach(a => {
                html += '<div class="pkg-option-row">';
                html += '<span class="pkg-chip">Optional</span>';
                html += '<div class="pkg-option-body">' + a.text
                    + ' <a href="' + a.href + '" target="_blank" rel="noopener">' + a.link + '</a></div>';
                html += '</div>';
            });

            pkg.notes.forEach(n => {
                html += '<p class="pkg-note">' + n + '</p>';
            });

            html += '</div>';
        }

        // ---- Request panel: ready to submit ----------------------------
        const summary =
            'Packaging request (from pivotchip.ca/packaging.html)\n'
            + 'Package: ' + pkg.tierName + '\n'
            + 'Devices: ' + pkg.devices.map(d => d.count + ' \u00d7 ' + d.name).join(', ') + '\n'
            + 'Support level: ' + support.name + '\n'
            + 'Testing frequency: ' + freqPhrase + '\n'
            + 'Client fleet: ' + fleetLine + '\n'
            + 'Capabilities: ' + capsText + '\n'
            + 'Source code review: ' + reviewShort
            + (pkg.scanKit ? '\nScanKit: ' + pkg.scanKit.mode : '');
        sessionStorage.setItem('pkg-result', summary);
        const contactUrl = 'contact.html?service=device-package&kit=' + encodeURIComponent(summary);
        const summaryOneLine = summary.replace(/\n/g, ' | ');

        html += '<div class="pkg-sec">';
        html += '<div class="pkg-sec-label">Request this package</div>';
        html += '<div class="pkg-request-panel">';
        html += '<p class="pkg-request-lead">We reply within 24 hours with availability, '
            + 'pricing and rental options.</p>';
        html += '<form id="pkg-request-form" action="https://getform.io/f/apjzqzra" method="POST">';
        html += '<input type="hidden" name="service" value="device-package">';
        html += '<input type="hidden" name="package_tier" value="' + attrEsc(pkg.tierName) + '">';
        html += '<input type="hidden" name="support_level" value="' + attrEsc(support.name) + '">';
        html += '<input type="hidden" name="package_summary" value="' + attrEsc(summaryOneLine) + '">';
        html += '<div class="pkg-form-grid">';
        html += '<div class="form-group"><label for="pkg-req-name">Full Name *</label>'
            + '<input type="text" id="pkg-req-name" name="name" placeholder="John Doe"></div>';
        html += '<div class="form-group"><label for="pkg-req-email">Email Address *</label>'
            + '<input type="email" id="pkg-req-email" name="email" placeholder="john@example.com"></div>';
        html += '<div class="form-group pkg-form-full"><label for="pkg-req-company">'
            + 'Company / Organization (optional)</label>'
            + '<input type="text" id="pkg-req-company" name="company" placeholder="Your Company Name"></div>';
        html += '</div>';
        html += '<div class="form-group"><label for="pkg-req-notes">Notes (optional)</label>'
            + '<textarea id="pkg-req-notes" name="notes" rows="2" '
            + 'placeholder="Timeline, sites, anything else we should know..."></textarea></div>';
        html += '<div class="pkg-request-actions">';
        html += '<button type="submit" class="btn btn-primary">Send Request</button>';
        html += '<a class="pkg-secondary-link" href="' + contactUrl + '">'
            + 'Prefer the full contact form? Continue &rarr;</a>';
        html += '</div>';
        html += '</form>';
        html += '</div>';
        html += '<div class="pkg-more-links">'
            + '<a href="pentesting-devices.html" target="_blank" rel="noopener">Browse the device lineup</a>'
            + ' &middot; '
            + '<a href="use-cases.html" target="_blank" rel="noopener">See real use cases</a>'
            + '</div>';
        html += '<p class="pkg-ethics">For authorized security assessments only. '
            + 'See our <a href="ethical-use-policy.html">Ethical Use Policy</a>.</p>';
        html += '</div>';

        container.innerHTML = html;

        // Validate the inline request form before it posts to getform.io
        const requestForm = document.getElementById('pkg-request-form');
        requestForm.addEventListener('submit', function (e) {
            const name = document.getElementById('pkg-req-name');
            const email = document.getElementById('pkg-req-email');
            if (name.value.trim() === '') {
                e.preventDefault();
                alert('Please enter your name');
                name.focus();
                return;
            }
            if (email.value.trim() === '' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
                e.preventDefault();
                alert('Please enter a valid email address');
                email.focus();
            }
        });
    }

    paintFreq(false);
    paintFleet(false);
    goToStep(1, false);
});