(() => {
    'use strict';

    const CONFIG = {
        host: location.hostname,
        debug: true,
        version: 'v1.0.0',
        author: 'vezekk',
        credits: 'DyRian',
        based: 'IHaxU'
    };

    class ModernBypassPanel {
        constructor() {
            this.container = null;
            this.shadow = null;
            this.statusText = null;
            this.statusIcon = null;
            this.progressBar = null;
            this.isMinimized = false;
            this.currentStatus = 'idle';
            this.isDragging = false;
            this.dragOffset = { x: 0, y: 0 };
            this.position = { x: window.innerWidth / 2 - 210, y: window.innerHeight / 2 - 200 };
            this.init();
        }

        init() {
            this.createPanel();
            this.setupEventListeners();
            this.setupDragging();
        }

        createPanel() {
            this.container = document.createElement('div');
            this.shadow = this.container.attachShadow({ mode: 'closed' });

            const style = document.createElement('style');
            style.textContent = `
                * { 
                    margin: 0; 
                    padding: 0; 
                    box-sizing: border-box; 
                }

                @keyframes fadeInScale {
                    0% { 
                        opacity: 0; 
                        transform: scale(0.92) translateY(10px);
                    }
                    100% { 
                        opacity: 1; 
                        transform: scale(1) translateY(0);
                    }
                }

                @keyframes slideIn {
                    0% { 
                        opacity: 0;
                        transform: translateX(-20px);
                    }
                    100% { 
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                @keyframes pulseGlow {
                    0%, 100% { 
                        box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.1);
                    }
                    50% { 
                        box-shadow: 0 0 0 8px rgba(255, 255, 255, 0);
                    }
                }

                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }

                @keyframes progressSlide {
                    0% { 
                        background-position: 0% 0%;
                    }
                    100% { 
                        background-position: 100% 0%;
                    }
                }

                @keyframes borderFlow {
                    0% { 
                        background-position: 0% 50%;
                    }
                    50% { 
                        background-position: 100% 50%;
                    }
                    100% { 
                        background-position: 0% 50%;
                    }
                }

                @keyframes collapse {
                    from {
                        max-height: 600px;
                        opacity: 1;
                    }
                    to {
                        max-height: 0;
                        opacity: 0;
                    }
                }

                @keyframes expand {
                    from {
                        max-height: 0;
                        opacity: 0;
                    }
                    to {
                        max-height: 600px;
                        opacity: 1;
                    }
                }

                .panel-wrapper {
                    position: fixed;
                    width: 420px;
                    z-index: 2147483647;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Helvetica Neue', sans-serif;
                    animation: fadeInScale 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
                    will-change: transform;
                    user-select: none;
                    -webkit-user-select: none;
                }

                .panel {
                    background: linear-gradient(165deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%);
                    border-radius: 16px;
                    box-shadow: 
                        0 20px 60px rgba(0, 0, 0, 0.9),
                        0 0 0 1px rgba(255, 255, 255, 0.1),
                        inset 0 1px 0 0 rgba(255, 255, 255, 0.05);
                    overflow: hidden;
                    backdrop-filter: blur(20px);
                    transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                }

                .panel::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 1px;
                    background: linear-gradient(90deg, 
                        transparent 0%, 
                        rgba(255, 255, 255, 0.1) 20%, 
                        rgba(255, 255, 255, 0.2) 50%, 
                        rgba(255, 255, 255, 0.1) 80%, 
                        transparent 100%
                    );
                }

                .panel.minimized {
                    transform: scale(0.98);
                }

                .header {
                    background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
                    padding: 20px 24px;
                    position: relative;
                    overflow: hidden;
                    cursor: move;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
                }

                .header::after {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    height: 2px;
                    background: linear-gradient(90deg, 
                        transparent, 
                        rgba(255, 255, 255, 0.15), 
                        transparent
                    );
                    background-size: 200% 100%;
                    animation: borderFlow 3s ease-in-out infinite;
                }

                .header-content {
                    position: relative;
                    z-index: 1;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }

                .brand {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    animation: slideIn 0.5s ease-out 0.1s both;
                }

                .brand-icon {
                    width: 36px;
                    height: 36px;
                    background: linear-gradient(135deg, #333 0%, #222 100%);
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 14px;
                    font-weight: 700;
                    color: #fff;
                    border: 1px solid rgba(255, 255, 255, 0.15);
                    box-shadow: 
                        0 4px 12px rgba(0, 0, 0, 0.5),
                        inset 0 1px 0 rgba(255, 255, 255, 0.1);
                    letter-spacing: -1px;
                }

                .brand-text h1 {
                    font-size: 18px;
                    font-weight: 700;
                    color: #ffffff;
                    letter-spacing: -0.5px;
                    margin-bottom: 2px;
                }

                .brand-text p {
                    font-size: 11px;
                    color: rgba(255, 255, 255, 0.5);
                    font-weight: 500;
                    letter-spacing: 0.3px;
                }

                .controls {
                    display: flex;
                    gap: 8px;
                    animation: slideIn 0.5s ease-out 0.2s both;
                }

                .control-btn {
                    width: 32px;
                    height: 32px;
                    background: rgba(255, 255, 255, 0.08);
                    border: 1px solid rgba(255, 255, 255, 0.12);
                    border-radius: 8px;
                    color: #fff;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 18px;
                    font-weight: 400;
                    line-height: 1;
                    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
                    backdrop-filter: blur(10px);
                }

                .control-btn:hover {
                    background: rgba(255, 255, 255, 0.15);
                    border-color: rgba(255, 255, 255, 0.25);
                    transform: translateY(-1px);
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
                }

                .control-btn:active {
                    transform: translateY(0);
                    transition-duration: 0.1s;
                }

                .body {
                    max-height: 600px;
                    overflow: hidden;
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .body.hidden {
                    max-height: 0;
                    opacity: 0;
                }

                .status-section {
                    padding: 24px;
                    background: rgba(255, 255, 255, 0.01);
                }

                .status-card {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 12px;
                    padding: 20px;
                    position: relative;
                    overflow: hidden;
                    transition: all 0.3s ease;
                }

                .status-card:hover {
                    background: rgba(255, 255, 255, 0.04);
                    border-color: rgba(255, 255, 255, 0.12);
                }

                .status-header {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    margin-bottom: 16px;
                    position: relative;
                    z-index: 1;
                }

                .status-icon {
                    width: 48px;
                    height: 48px;
                    min-width: 48px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 11px;
                    font-weight: 700;
                    letter-spacing: 0.5px;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                    border: 1px solid rgba(255, 255, 255, 0.15);
                    text-transform: uppercase;
                }

                .status-icon.idle {
                    background: linear-gradient(135deg, #2a2a2a, #1a1a1a);
                    color: #aaa;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                }

                .status-icon.processing {
                    background: linear-gradient(135deg, #3a3a3a, #2a2a2a);
                    color: #ddd;
                    box-shadow: 0 4px 16px rgba(255, 255, 255, 0.1);
                    animation: pulseGlow 2s ease-in-out infinite;
                }

                .status-icon.processing::after {
                    content: '';
                    position: absolute;
                    width: 24px;
                    height: 24px;
                    border: 2px solid rgba(255, 255, 255, 0.2);
                    border-top-color: #fff;
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                }

                .status-icon.success {
                    background: linear-gradient(135deg, #2a2a2a, #1f1f1f);
                    color: #fff;
                    box-shadow: 0 4px 16px rgba(255, 255, 255, 0.15);
                }

                .status-icon.warning {
                    background: linear-gradient(135deg, #3a3a3a, #2a2a2a);
                    color: #e5e5e5;
                    box-shadow: 0 4px 16px rgba(255, 255, 255, 0.1);
                }

                .status-icon.error {
                    background: linear-gradient(135deg, #2a2a2a, #1a1a1a);
                    color: #999;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                }

                .status-info {
                    flex: 1;
                    min-width: 0;
                }

                .status-info h3 {
                    color: rgba(255, 255, 255, 0.4);
                    font-size: 11px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    margin-bottom: 6px;
                }

                .status-info p {
                    color: #ffffff;
                    font-size: 15px;
                    font-weight: 600;
                    line-height: 1.4;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .progress-container {
                    position: relative;
                    height: 6px;
                    background: rgba(255, 255, 255, 0.06);
                    border-radius: 10px;
                    overflow: hidden;
                    z-index: 1;
                }

                .progress-bar {
                    height: 100%;
                    background: linear-gradient(90deg, #3a3a3a, #5a5a5a, #3a3a3a);
                    background-size: 200% 100%;
                    border-radius: 10px;
                    transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    animation: progressSlide 2s linear infinite;
                    box-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
                    position: relative;
                }

                .progress-bar::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 100%;
                    background: linear-gradient(90deg, 
                        transparent, 
                        rgba(255, 255, 255, 0.3), 
                        transparent
                    );
                }

                .info-section {
                    padding: 24px;
                    background: rgba(0, 0, 0, 0.15);
                    border-top: 1px solid rgba(255, 255, 255, 0.05);
                }

                .info-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 12px;
                }

                .info-item {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 10px;
                    padding: 14px;
                    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .info-item:hover {
                    background: rgba(255, 255, 255, 0.05);
                    border-color: rgba(255, 255, 255, 0.15);
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                }

                .info-item-label {
                    font-size: 10px;
                    color: rgba(255, 255, 255, 0.4);
                    text-transform: uppercase;
                    letter-spacing: 0.8px;
                    margin-bottom: 6px;
                    font-weight: 600;
                }

                .info-item-value {
                    font-size: 14px;
                    color: #ffffff;
                    font-weight: 700;
                    letter-spacing: -0.2px;
                }

                .footer {
                    padding: 14px 24px;
                    text-align: center;
                    background: rgba(0, 0, 0, 0.2);
                    border-top: 1px solid rgba(255, 255, 255, 0.05);
                }

                .footer-text {
                    font-size: 10px;
                    color: rgba(255, 255, 255, 0.3);
                    font-weight: 500;
                    letter-spacing: 0.3px;
                }

                .footer-text strong {
                    color: rgba(255, 255, 255, 0.6);
                    font-weight: 700;
                }

                @media (max-width: 480px) {
                    .panel-wrapper {
                        width: calc(100% - 24px) !important;
                        left: 12px !important;
                        top: 12px !important;
                    }

                    .info-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `;

            this.shadow.appendChild(style);

            const panelHTML = `
                <div class="panel-wrapper">
                    <div class="panel">
                        <div class="header" id="panel-header">
                            <div class="header-content">
                                <div class="brand">
                                    <div class="brand-icon">[V]</div>
                                    <div class="brand-text">
                                        <h1>Bypasser</h1>
                                        <p>Volcano Key Bypasser</p>
                                    </div>
                                </div>
                                <div class="controls">
                                    <button class="control-btn" id="minimize-btn" title="Minimize">−</button>
                                </div>
                            </div>
                        </div>
                        <div class="body" id="panel-body">
                            <div class="status-section">
                                <div class="status-card">
                                    <div class="status-header">
                                        <div class="status-icon idle" id="status-icon">IDLE</div>
                                        <div class="status-info">
                                            <h3>Current Status</h3>
                                            <p id="status-text">Initializing system...</p>
                                        </div>
                                    </div>
                                    <div class="progress-container">
                                        <div class="progress-bar" id="progress-bar" style="width: 0%"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="info-section">
                                <div class="info-grid">
                                    <div class="info-item">
                                        <div class="info-item-label">Version</div>
                                        <div class="info-item-value">${CONFIG.version}</div>
                                    </div>
                                    <div class="info-item">
                                        <div class="info-item-label">Status</div>
                                        <div class="info-item-value" id="status-badge">Active</div>
                                    </div>
                                    <div class="info-item">
                                        <div class="info-item-label">Author</div>
                                        <div class="info-item-value">${CONFIG.author}</div>
                                    </div>
                                    <div class="info-item">
                                        <div class="info-item-label">Based On</div>
                                        <div class="info-item-value">${CONFIG.based}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="footer">
                            <p class="footer-text">Powered by <strong>DyRian (Modified by vezekk)</strong> © 2025</p>
                        </div>
                    </div>
                </div>
            `;

            const wrapper = document.createElement('div');
            wrapper.innerHTML = panelHTML;
            this.shadow.appendChild(wrapper.firstElementChild);

            this.panelWrapper = this.shadow.querySelector('.panel-wrapper');
            this.panel = this.shadow.querySelector('.panel');
            this.header = this.shadow.querySelector('#panel-header');
            this.statusText = this.shadow.querySelector('#status-text');
            this.statusIcon = this.shadow.querySelector('#status-icon');
            this.progressBar = this.shadow.querySelector('#progress-bar');
            this.statusBadge = this.shadow.querySelector('#status-badge');
            this.body = this.shadow.querySelector('#panel-body');
            this.minimizeBtn = this.shadow.querySelector('#minimize-btn');

            document.documentElement.appendChild(this.container);
            this.updatePosition();
        }

        setupEventListeners() {
            this.minimizeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.isMinimized = !this.isMinimized;
                this.body.classList.toggle('hidden');
                this.panel.classList.toggle('minimized');
                this.minimizeBtn.textContent = this.isMinimized ? '+' : '−';
            });
        }

        setupDragging() {
            const handleMouseDown = (e) => {
                if (e.target.closest('.control-btn')) return;
                this.isDragging = true;
                this.dragOffset.x = e.clientX - this.position.x;
                this.dragOffset.y = e.clientY - this.position.y;
                this.panelWrapper.style.transition = 'none';
                this.panelWrapper.style.cursor = 'grabbing';
                this.header.style.cursor = 'grabbing';
                e.preventDefault();
            };

            const handleMouseMove = (e) => {
                if (!this.isDragging) return;
                this.position.x = e.clientX - this.dragOffset.x;
                this.position.y = e.clientY - this.dragOffset.y;
                this.updatePosition();
            };

            const handleMouseUp = () => {
                if (this.isDragging) {
                    this.isDragging = false;
                    this.panelWrapper.style.transition = '';
                    this.panelWrapper.style.cursor = '';
                    this.header.style.cursor = 'move';
                    this.constrainPosition();
                }
            };

            const handleTouchStart = (e) => {
                if (e.target.closest('.control-btn')) return;
                const touch = e.touches[0];
                this.isDragging = true;
                this.dragOffset.x = touch.clientX - this.position.x;
                this.dragOffset.y = touch.clientY - this.position.y;
                this.panelWrapper.style.transition = 'none';
                e.preventDefault();
            };

            const handleTouchMove = (e) => {
                if (!this.isDragging) return;
                const touch = e.touches[0];
                this.position.x = touch.clientX - this.dragOffset.x;
                this.position.y = touch.clientY - this.dragOffset.y;
                this.updatePosition();
            };

            const handleTouchEnd = () => {
                if (this.isDragging) {
                    this.isDragging = false;
                    this.panelWrapper.style.transition = '';
                    this.constrainPosition();
                }
            };

            this.header.addEventListener('mousedown', handleMouseDown);
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);

            this.header.addEventListener('touchstart', handleTouchStart, { passive: false });
            document.addEventListener('touchmove', handleTouchMove, { passive: false });
            document.addEventListener('touchend', handleTouchEnd);

            window.addEventListener('resize', () => this.constrainPosition());
        }

        updatePosition() {
            this.panelWrapper.style.left = `${this.position.x}px`;
            this.panelWrapper.style.top = `${this.position.y}px`;
        }

        constrainPosition() {
            const rect = this.panelWrapper.getBoundingClientRect();
            const maxX = window.innerWidth - rect.width;
            const maxY = window.innerHeight - rect.height;

            this.position.x = Math.max(0, Math.min(this.position.x, maxX));
            this.position.y = Math.max(0, Math.min(this.position.y, maxY));

            this.panelWrapper.style.transition = 'left 0.3s ease, top 0.3s ease';
            this.updatePosition();
            
            setTimeout(() => {
                this.panelWrapper.style.transition = '';
            }, 300);
        }

        updateStatus(message, type = 'idle', progress = 0, icon = 'IDLE') {
            this.currentStatus = type;
            this.statusText.textContent = message;
            this.statusIcon.className = `status-icon ${type}`;
            this.statusIcon.textContent = icon;
            this.progressBar.style.width = `${progress}%`;

            const statusMap = {
                idle: 'Idle',
                processing: 'Processing',
                success: 'Success',
                warning: 'Warning',
                error: 'Error'
            };
            this.statusBadge.textContent = statusMap[type] || 'Active';
        }
    }

    let panel = null;
    setTimeout(() => {
        panel = new ModernBypassPanel();
        panel.updateStatus('Waiting for CAPTCHA...', 'idle', 10, 'WAIT');
    }, 100);

    if (CONFIG.host.includes("key.volcano.wtf")) handleVolcano();
    else if (CONFIG.host.includes("work.ink")) handleWorkInk();

    function handleVolcano() {
        if (panel) panel.updateStatus('Please solve the CAPTCHA to continue', 'idle', 20, 'LOCK');
        if (CONFIG.debug) console.log('[Bypass] Waiting for CAPTCHA');

        let continueClicked = false;
        let copyClicked = false;

        function processCheckpoint(node) {
            if (!continueClicked) {
                const buttons = node?.nodeType === 1
                    ? node.matches('#primaryButton[type="submit"], button[type="submit"], a, input[type=button], input[type=submit]')
                        ? [node]
                        : node.querySelectorAll('#primaryButton[type="submit"], button[type="submit"], a, input[type=button], input[type=submit]')
                    : document.querySelectorAll('#primaryButton[type="submit"], button[type="submit"], a, input[type=button], input[type=submit]');

                for (const btn of buttons) {
                    const text = (btn.innerText || btn.value || '').trim().toLowerCase();
                    if (text.includes('continue') || text.includes('next step')) {
                        const disabled = btn.disabled || btn.getAttribute('aria-disabled') === 'true';
                        const style = getComputedStyle(btn);
                        const visible = style.display !== 'none' && style.visibility !== 'hidden' && btn.offsetParent !== null;

                        if (visible && !disabled) {
                            continueClicked = true;
                            if (panel) panel.updateStatus('CAPTCHA solved successfully!', 'success', 60, 'OK');
                            if (CONFIG.debug) console.log('[Bypass] CAPTCHA solved');

                            setTimeout(() => {
                                try {
                                    btn.click();
                                    if (panel) panel.updateStatus('Redirecting to Work.ink...', 'processing', 80, 'GO');
                                    if (CONFIG.debug) console.log('[Bypass] Clicking continue button');
                                } catch (err) {
                                    if (CONFIG.debug) console.error('[Bypass] Continue click failed', err);
                                }
                            }, 300);
                            return true;
                        }
                    }
                }
            }

            const copyBtn = node?.nodeType === 1
                ? node.matches('#copy-key-btn, .copy-btn, [aria-label="Copy"]')
                    ? node
                    : node.querySelector('#copy-key-btn, .copy-btn, [aria-label="Copy"]')
                : document.querySelector('#copy-key-btn, .copy-btn, [aria-label="Copy"]');

            if (copyBtn && !copyClicked) {
                copyClicked = true;
                setInterval(() => {
                    try {
                        copyBtn.click();
                        if (CONFIG.debug) console.log('[Bypass] Auto-clicking copy button');
                        if (panel) panel.updateStatus('Bypass complete! Key copied to clipboard', 'success', 100, 'DONE');
                    } catch (err) {
                        if (CONFIG.debug) console.error('[Bypass] Copy click failed', err);
                    }
                }, 500);
                return true;
            }

            return false;
        }

        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === 1) {
                            if (processCheckpoint(node) && copyClicked) {
                                observer.disconnect();
                                return;
                            }
                        }
                    }
                }
                if (mutation.type === 'attributes' && mutation.target.nodeType === 1) {
                    if (processCheckpoint(mutation.target) && copyClicked) {
                        observer.disconnect();
                        return;
                    }
                }
            }
        });

        observer.observe(document.documentElement, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['disabled', 'aria-disabled', 'style']
        });

        if (processCheckpoint() && copyClicked) observer.disconnect();
    }

    function handleWorkInk() {
        if (panel) panel.updateStatus('Analyzing Work.ink session...', 'processing', 15, 'SCAN');

        const startTime = Date.now();
        let sessionController = undefined;
        let sendMessage = undefined;
        let onLinkInfo = undefined;
        let linkInfo = undefined;
        let onLinkDestination = undefined;
        let bypassTriggered = false;
        let destinationReceived = false;

        const propertyMap = {
            onLI: ['onLinkInfo'],
            onLD: ['onLinkDestination']
        };

        const messageTypes = {
            an: 'c_announce',
            mo: 'c_monetization',
            ss: 'c_social_started',
            rr: 'c_recaptcha_response',
            hr: 'c_hcaptcha_response',
            tr: 'c_turnstile_response',
            ad: 'c_adblocker_detected',
            fl: 'c_focus_lost',
            os: 'c_offers_skipped',
            ok: 'c_offer_skipped',
            fo: 'c_focus',
            wp: 'c_workink_pass_available',
            wu: 'c_workink_pass_use',
            pi: 'c_ping',
            kk: 'c_keyapp_key'
        };

        function findMethod(obj, candidates) {
            if (!obj || typeof obj !== 'object') return { fn: null, index: -1, name: null };
            for (let i = 0; i < candidates.length; i++) {
                const name = candidates[i];
                if (typeof obj[name] === 'function') {
                    return { fn: obj[name], index: i, name };
                }
            }
            return { fn: null, index: -1, name: null };
        }

        function findWriteFunction(obj) {
            if (!obj || typeof obj !== 'object') return { fn: null, index: -1, name: null };
            for (let key in obj) {
                if (typeof obj[key] === 'function' && obj[key].length === 2) {
                    return { fn: obj[key], name: key };
                }
            }
            return { fn: null, index: -1, name: null };
        }

        function initiateByppass(reason) {
            if (bypassTriggered) {
                if (CONFIG.debug) console.log('[Bypass] Already triggered, skipping');
                return;
            }

            if (CONFIG.debug) {
                console.log('[Bypass] WebSocket:', {
                    exists: !!sessionController?.websocket,
                    state: sessionController?.websocket?.readyState,
                    url: sessionController?.websocket?.url
                });
            }

            bypassTriggered = true;
            if (CONFIG.debug) console.log('[Bypass] Initiated via:', reason);
            if (panel) panel.updateStatus('CAPTCHA bypassed! Processing...', 'success', 70, 'RUN');

            let attemptCount = 0;
            function continueSpoofing() {
                if (destinationReceived) {
                    if (CONFIG.debug) console.log('[Bypass] Destination received after', attemptCount, 'attempts');
                    return;
                }
                attemptCount++;
                if (CONFIG.debug) console.log(`[Bypass] Spoofing attempt #${attemptCount}`);
                executeSpoofing();
                setTimeout(continueSpoofing, 3000);
            }
            continueSpoofing();
        }

        function executeSpoofing() {
            if (!linkInfo) {
                if (CONFIG.debug) console.log('[Bypass] No link info available');
                return;
            }

            const socials = linkInfo.socials || [];
            if (CONFIG.debug) console.log('[Bypass] Processing', socials.length, 'social tasks');

            if (socials.length > 0) {
                if (panel) panel.updateStatus('Bypassing social verification...', 'warning', 85, 'WORK');

                (async () => {
                    for (let i = 0; i < socials.length; i++) {
                        const social = socials[i];
                        try {
                            if (sendMessage && sessionController) {
                                const payload = { url: social.url };

                                if (sessionController.websocket?.readyState === WebSocket.OPEN) {
                                    if (CONFIG.debug) console.log(`[Bypass] Sending social ${i + 1}/${socials.length}`);
                                    sendMessage.call(sessionController, messageTypes.ss, payload);
                                } else {
                                    if (CONFIG.debug) console.error('[Bypass] WebSocket not ready:', sessionController.websocket?.readyState);
                                    await new Promise(resolve => setTimeout(resolve, 1000));
                                    i--;
                                    continue;
                                }
                            }
                        } catch (err) {
                            if (CONFIG.debug) console.error(`[Bypass] Social ${i + 1} failed:`, err);
                        }
                    }

                    if (CONFIG.debug) console.log('[Bypass] All socials processed, reloading...');
                    setTimeout(() => window.location.reload(), 1000);
                })();
            } else {
                processMonetizations();
            }
        }

        function processMonetizations() {
            const monetizations = sessionController?.monetizations || [];
            if (CONFIG.debug) console.log('[Bypass] Processing', monetizations.length, 'monetizations');

            monetizations.forEach((monetization, index) => {
                const { id, sendMessage: monetizationSend } = monetization;
                if (!monetizationSend) return;

                try {
                    switch (id) {
                        case 22:
                            monetizationSend.call(monetization, { event: 'read' });
                            if (CONFIG.debug) console.log(`[Bypass] Completed readArticles2 ${index + 1}/${monetizations.length}`);
                            break;
                        case 25:
                            monetizationSend.call(monetization, { event: 'start' });
                            monetizationSend.call(monetization, { event: 'installedClicked' });
                            fetch('/_api/v2/affiliate/operaGX', { method: 'GET', mode: 'no-cors' });
                            setTimeout(() => {
                                fetch('https://work.ink/_api/v2/callback/operaGX', {
                                    method: 'POST',
                                    mode: 'no-cors',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ noteligible: true })
                                });
                            }, 5000);
                            if (CONFIG.debug) console.log(`[Bypass] Completed operaGX ${index + 1}/${monetizations.length}`);
                            break;
                        case 34:
                            monetizationSend.call(monetization, { event: 'start' });
                            monetizationSend.call(monetization, { event: 'installedClicked' });
                            if (CONFIG.debug) console.log(`[Bypass] Completed norton ${index + 1}/${monetizations.length}`);
                            break;
                        case 71:
                            monetizationSend.call(monetization, { event: 'start' });
                            monetizationSend.call(monetization, { event: 'installed' });
                            if (CONFIG.debug) console.log(`[Bypass] Completed externalArticles ${index + 1}/${monetizations.length}`);
                            break;
                        case 45:
                            monetizationSend.call(monetization, { event: 'installed' });
                            if (CONFIG.debug) console.log(`[Bypass] Completed pdfeditor ${index + 1}/${monetizations.length}`);
                            break;
                        case 57:
                            monetizationSend.call(monetization, { event: 'installed' });
                            if (CONFIG.debug) console.log(`[Bypass] Completed betterdeals ${index + 1}/${monetizations.length}`);
                            break;
                    }
                } catch (err) {
                    if (CONFIG.debug) console.error(`[Bypass] Monetization ${index + 1} failed:`, err);
                }
            });
        }

        function createSendProxy() {
            return function (...args) {
                const [type, data] = args;
                if (type !== messageTypes.pi && CONFIG.debug) {
                    console.log('[Bypass] Message sent:', type, data);
                }
                if (type === messageTypes.ad) {
                    if (CONFIG.debug) console.log('[Bypass] Blocked adblock detection');
                    return;
                }
                if ([messageTypes.tr, messageTypes.rr, messageTypes.hr].includes(type)) {
                    if (CONFIG.debug) console.log('[Bypass] CAPTCHA response detected');
                    initiateByppass('captcha_response');
                }
                return sendMessage?.apply(this, args);
            };
        }

        function createLinkInfoProxy() {
            return function (...args) {
                linkInfo = args[0];
                if (CONFIG.debug) console.log('[Bypass] Link info received:', linkInfo);
                executeSpoofing();
                try {
                    Object.defineProperty(linkInfo, 'isAdblockEnabled', {
                        get: () => false,
                        set: () => { },
                        configurable: false,
                        enumerable: true
                    });
                } catch (err) {
                    if (CONFIG.debug) console.warn('[Bypass] Property definition failed:', err);
                }
                return onLinkInfo?.apply(this, args);
            };
        }

        function createDestinationProxy() {
            return function (...args) {
                const data = args[0];
                const elapsed = (Date.now() - startTime) / 1000;
                destinationReceived = true;
                if (CONFIG.debug) console.log('[Bypass] Destination:', data.url);

                let waitTime = 5;
                const url = location.href;
                if (url.includes('42rk6hcq') || url.includes('ito4wckq') || url.includes('pzarvhq1')) {
                    waitTime = 38;
                }

                if (elapsed >= waitTime) {
                    if (panel) panel.updateStatus('Redirecting to destination...', 'success', 95, 'EXIT');
                    setTimeout(() => window.location.href = data.url, 500);
                } else {
                    const remaining = waitTime - elapsed;
                    if (panel) panel.updateStatus(`Redirecting in ${Math.ceil(remaining)}s...`, 'warning', 90, 'TIME');
                    
                    const countdown = setInterval(() => {
                        const timeLeft = waitTime - ((Date.now() - startTime) / 1000);
                        if (timeLeft > 0) {
                            if (panel) panel.updateStatus(`Redirecting in ${Math.ceil(timeLeft)}s...`, 'warning', 90, 'TIME');
                        } else {
                            clearInterval(countdown);
                            window.location.href = data.url;
                        }
                    }, 1000);
                }
                return onLinkDestination?.apply(this, args);
            };
        }

        function installProxies() {
            const sendFunc = findWriteFunction(sessionController);
            const infoFunc = findMethod(sessionController, propertyMap.onLI);
            const destFunc = findMethod(sessionController, propertyMap.onLD);

            sendMessage = sendFunc.fn;
            onLinkInfo = infoFunc.fn;
            onLinkDestination = destFunc.fn;

            Object.defineProperty(sessionController, sendFunc.name, {
                get: () => createSendProxy(),
                set: (v) => { sendMessage = v; },
                configurable: false,
                enumerable: true
            });

            Object.defineProperty(sessionController, infoFunc.name, {
                get: () => createLinkInfoProxy(),
                set: (v) => { onLinkInfo = v; },
                configurable: false,
                enumerable: true
            });

            Object.defineProperty(sessionController, destFunc.name, {
                get: () => createDestinationProxy(),
                set: (v) => { onLinkDestination = v; },
                configurable: false,
                enumerable: true
            });

            if (CONFIG.debug) console.log('[Bypass] Proxies installed:', sendFunc.name, infoFunc.name, destFunc.name);
        }

        function detectController(target, prop, value) {
            if (value && typeof value === 'object' &&
                findWriteFunction(value).fn &&
                findMethod(value, propertyMap.onLI).fn &&
                findMethod(value, propertyMap.onLD).fn &&
                !sessionController) {
                sessionController = value;
                if (CONFIG.debug) console.log('[Bypass] Session controller detected');
                if (panel) panel.updateStatus('Session controller hooked', 'success', 50, 'HOOK');
                installProxies();
            }
            return Reflect.set(target, prop, value);
        }

        function proxyComponent(component) {
            return new Proxy(component, {
                construct(target, args) {
                    const instance = Reflect.construct(target, args);
                    if (instance.$$.ctx) {
                        instance.$$.ctx = new Proxy(instance.$$.ctx, { set: detectController });
                    }
                    return instance;
                }
            });
        }

        function proxyNodeResult(result) {
            return new Proxy(result, {
                get: (target, prop) => {
                    if (prop === 'component') {
                        return proxyComponent(target.component);
                    }
                    return Reflect.get(target, prop);
                }
            });
        }

        function proxyNode(originalNode) {
            return async (...args) => {
                const result = await originalNode(...args);
                return proxyNodeResult(result);
            };
        }

        function proxyKit(kit) {
            if (!kit?.start) return [false, kit];

            return [
                true,
                new Proxy(kit, {
                    get(target, prop) {
                        if (prop === 'start') {
                            return function (...args) {
                                const [appModule, , options] = args;
                                if (appModule?.nodes && options?.node_ids) {
                                    const nodeIndex = options.node_ids[1];
                                    const originalNode = appModule.nodes[nodeIndex];
                                    appModule.nodes[nodeIndex] = proxyNode(originalNode);
                                }
                                if (CONFIG.debug) console.log('[Bypass] Kit intercepted');
                                return kit.start.apply(this, args);
                            };
                        }
                        return Reflect.get(target, prop);
                    }
                })
            ];
        }

        function setupInterception() {
            const originalPromiseAll = Promise.all;
            let intercepted = false;

            Promise.all = async function (promises) {
                const result = originalPromiseAll.call(this, promises);
                if (!intercepted) {
                    intercepted = true;
                    return await new Promise((resolve) => {
                        result.then(([kit, app, ...rest]) => {
                            if (CONFIG.debug) console.log('[Bypass] Interception active');
                            const [success, proxiedKit] = proxyKit(kit);
                            if (success) {
                                Promise.all = originalPromiseAll;
                                if (CONFIG.debug) console.log('[Bypass] Kit proxied successfully');
                                if (panel) panel.updateStatus('Framework intercepted', 'success', 30, 'TRAP');
                            }
                            resolve([proxiedKit, app, ...rest]);
                        });
                    });
                }
                return await result;
            };
        }

        window.googletag = { cmd: [], _loaded_: true };

        const blockedSelectors = {
            classes: ['adsbygoogle', 'adsense-wrapper', 'inline-ad', 'gpt-billboard-container'],
            ids: ['billboard-1', 'billboard-2', 'billboard-3', 'sidebar-ad-1', 'skyscraper-ad-1']
        };

        setupInterception();

        const adBlocker = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType !== 1) continue;

                    blockedSelectors.classes.forEach(cls => {
                        if (node.classList?.contains(cls)) {
                            node.remove();
                            if (CONFIG.debug) console.log('[Bypass] Removed ad:', cls);
                        }
                        node.querySelectorAll?.(`.${cls}`).forEach(el => el.remove());
                    });

                    blockedSelectors.ids.forEach(id => {
                        if (node.id === id) {
                            node.remove();
                            if (CONFIG.debug) console.log('[Bypass] Removed ad:', id);
                        }
                        node.querySelectorAll?.(`#${id}`).forEach(el => el.remove());
                    });

                    if (node.matches('.button.large.accessBtn.pos-relative') && node.textContent.includes('Go To Destination')) {
                        if (CONFIG.debug) console.log('[Bypass] GTD button detected');

                        if (!bypassTriggered) {
                            let retryCount = 0;
                            function checkAndTrigger() {
                                const destFunc = findMethod(sessionController, propertyMap.onLD);
                                if (sessionController && linkInfo && destFunc.fn) {
                                    initiateByppass('gtd_button');
                                    if (CONFIG.debug) console.log('[Bypass] Triggered via GTD after', retryCount, 'retries');
                                } else {
                                    retryCount++;
                                    if (CONFIG.debug) console.log(`[Bypass] GTD retry ${retryCount}...`);
                                    if (panel) panel.updateStatus('Waiting for link data...', 'warning', 40, 'WAIT');
                                    setTimeout(checkAndTrigger, 1000);
                                }
                            }
                            checkAndTrigger();
                        }
                    }
                }
            }
        });

        adBlocker.observe(document.documentElement, { childList: true, subtree: true });
    }
})();