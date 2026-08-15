/* ── PRODUCT DATA ── */
    const PRODUCTS = [
      { id: 'black-card', code: 'BNC30', name: 'Black NFC 215 Card', price: 30, emoji: '🖤', category: 'nfc' },
      { id: 'white-card', code: 'WNC25', name: 'PVC NFC Business Card NTAG216', price: 30, emoji: '🤍', category: 'nfc' },
      { id: 'blank-card', code: 'WBC33', name: 'White Inkjet NTAG215 Card', price: 32.80, emoji: '⬜', category: 'nfc' },
      { id: 'anti-metal', code: 'MNT20', name: 'Anti-Metal NFC Tag', price: 20, emoji: '🔩', category: 'nfc' },
      { id: 'rfid-tag', code: 'RNT18', name: 'NTAG216 Stickers NFC Tag', price: 18, emoji: '📡', category: 'nfc' },
      { id: 'nfc-coin', code: 'WNC15', name: 'NTAG 215 Coin 25mm', price: 20, emoji: '🪙', category: 'nfc' },
      { id: 'mini-tag', code: 'MNT11', name: 'Mini NFC Tag (3D Printing / Jewellery)', price: 11, emoji: '💎', category: 'nfc' },
      { id: 'flex-nfc', code: 'FNT75', name: 'Micro Flex NFC Tag (FPC)', price: 75, emoji: '⚡', category: 'nfc' },
      { id: 'uhf-rfid', code: 'URL25', name: 'UHF RFID Label Sticker 27×15mm', price: 25, emoji: '🏷️', category: 'rfid' },
      { id: 'inkjet-print-nfc', code: 'INK50', name: 'NFC Card with Custom Printing', price: 75, emoji: '🖨️', category: 'nfc' },
      { id: 'inkjet-print-rfid', code: 'INK50', name: 'RFID Card with Custom Printing', price: 75, emoji: '🖨️', category: 'rfid' },
       { id: 'wrist-rfid', code: 'INK50', name: 'NFC Wrist Band', price: 80, emoji: '🖨️', category: 'nfc' },
      {
        id: 'sample-kit', code: 'SMPL', name: 'Complete NFC Sample Kit', price: 1940, emoji: '🎁',
        fixed: true, fixedQty: 70, fixedLabel: '1 kit · 70 pcs · All types', category: 'nfc'
      },
      { id: 'google-review-card', code: 'GRV95', name: 'Google Review Cards', price: 95, emoji: '⭐', category: 'nfc' },
    ];

    /* Active category filter: 'nfc' | 'rfid' */
    let activeCategory = 'nfc';

    /* State */
    let selectedIds = new Set();
    let quantities = {};
    let fetchedCity = '', fetchedState = '';

    /* Quote number */
    const quoteNum = 'QT-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    document.getElementById('quoteNum').textContent = quoteNum;

    /* Dates */
    const now = new Date();
    const valid = new Date(now); valid.setDate(valid.getDate() + 15);
    const fmtDate = d => d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    document.getElementById('quoteDate').textContent = fmtDate(now);
    document.getElementById('quoteValidUntil').textContent = fmtDate(valid);

    /* Init QR */
    const qrcodeContainer = new QRCode(document.getElementById('qrcode'), {
      width: 140, height: 140,
      colorDark: '#1A1714', colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.M
    });

    /* ── GST FIELD TOGGLE ── */
    function toggleGstField() {
      const checked = document.getElementById('gstCheck').checked;
      const wrap = document.getElementById('gstFieldWrap');
      if (checked) {
        wrap.classList.add('visible');
      } else {
        wrap.classList.remove('visible');
      }
    }

    /* ── RENDER PRODUCT GRID ── */
    function renderGrid() {
      const grid = document.getElementById('productGrid');
      const visible = PRODUCTS.filter(p => p.category === activeCategory || p.category === 'both');
      grid.innerHTML = visible.map(p => `
      <div class="prod-card ${p.fixed ? 'bundle-card' : ''} ${selectedIds.has(p.id) ? 'selected' : ''}"
           onclick="toggleProduct('${p.id}')" data-id="${p.id}">
        <div class="check">
          <svg viewBox="0 0 10 8"><path d="M1 4L3.5 6.5L9 1" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>
        </div>
        ${p.fixed ? '<div class="bundle-badge">★ Bundle</div>' : ''}
        <div class="prod-name">${p.emoji} ${p.name}</div>
        <div class="prod-code">${p.code}${p.fixed ? ' · 70 pcs' : ''}</div>
        <div class="prod-price">₹${p.price.toLocaleString('en-IN')}<span>/${p.fixed ? 'kit' : 'pc'}</span></div>
      </div>
    `).join('');
    }

    /* ── CATEGORY TOGGLE (NFC / RFID) ── */
    function setCategory(cat) {
      if (cat === activeCategory) return;
      activeCategory = cat;

      const toggle = document.getElementById('catToggle');
      toggle.classList.toggle('rfid-active', cat === 'rfid');
      toggle.querySelectorAll('.cat-tab').forEach(btn => {
        const isActive = btn.dataset.cat === cat;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });

      const grid = document.getElementById('productGrid');
      grid.classList.add('switching');
      setTimeout(() => {
        renderGrid();
        grid.classList.remove('switching');
      }, 180);
    }

    /* ── RENDER SELECTED ITEMS (qty inputs) ── */
    function renderSelectedItems() {
      const section = document.getElementById('selectedSection');
      const hint = document.getElementById('emptyHint');
      const container = document.getElementById('selectedItems');

      if (selectedIds.size === 0) {
        section.style.display = 'none';
        hint.style.display = 'block';
        return;
      }
      section.style.display = 'block';
      hint.style.display = 'none';

      container.innerHTML = [...selectedIds].map(id => {
        const p = PRODUCTS.find(x => x.id === id);
        const qty = p.fixed ? 1 : (quantities[id] || 0);
        const subtotal = p.price * qty;
        return `
        <div class="item-row ${p.fixed ? 'bundle-row' : ''}" id="row-${id}">
          <div class="item-label">
            <div class="iname">${p.emoji} ${p.name}</div>
            <div class="iprice">${p.fixed
            ? `₹${p.price.toLocaleString('en-IN')}/kit · ${p.fixedLabel}`
            : `₹${p.price}/pc · ${p.code}`
          }</div>
          </div>
          <div class="qty-ctrl">
            ${p.fixed
            ? `<div class="fixed-qty-label">Fixed · 1 kit</div>`
            : `<button class="qty-btn" onclick="adjustQty('${id}',-1)">−</button>
                 <input class="qty-input" type="number" min="10" step="1" value="${qty}"
                        oninput="setQty('${id}',this.value)" onblur="enforceMoq('${id}')" id="qty-${id}">
                 <button class="qty-btn" onclick="adjustQty('${id}',1)">+</button>`
          }
          </div>
          <div class="item-total" id="total-${id}">${subtotal > 0 ? '₹' + subtotal.toLocaleString('en-IN') : '-'}</div>
        </div>
      `;
      }).join('');
    }

    /* ── TOGGLE PRODUCT ── */
    function toggleProduct(id) {
      if (selectedIds.has(id)) {
        selectedIds.delete(id);
        delete quantities[id];
      } else {
        selectedIds.add(id);
        const p = PRODUCTS.find(x => x.id === id);
        if (!p.fixed && !quantities[id]) quantities[id] = MOQ;
      }
      renderGrid();
      renderSelectedItems();
      calculateQuote();
    }

    /* ── QTY CONTROLS (MOQ = 10 pcs per product) ── */
    const MOQ = 10;

    function adjustQty(id, delta) {
      const current = quantities[id] || MOQ;
      quantities[id] = Math.max(MOQ, current + delta);
      const inp = document.getElementById('qty-' + id);
      if (inp) inp.value = quantities[id];
      updateItemTotal(id);
      calculateQuote();
    }

    function setQty(id, val) {
      // Allow free typing (so users can type multi-digit numbers), but never let it go negative.
      const parsed = parseInt(val, 10);
      quantities[id] = isNaN(parsed) ? 0 : Math.max(0, parsed);
      updateItemTotal(id);
      calculateQuote();
    }

    function enforceMoq(id) {
      // Snap back up to the MOQ once the user leaves the field if they typed below it.
      if ((quantities[id] || 0) < MOQ) {
        quantities[id] = MOQ;
        const inp = document.getElementById('qty-' + id);
        if (inp) inp.value = MOQ;
        updateItemTotal(id);
        calculateQuote();
      }
    }

    function updateItemTotal(id) {
      const p = PRODUCTS.find(x => x.id === id);
      const qty = p.fixed ? 1 : (quantities[id] || 0);
      const el = document.getElementById('total-' + id);
      if (el) el.textContent = qty > 0 ? '₹' + (p.price * qty).toLocaleString('en-IN') : '-';
    }

    /* ── PINCODE ── */
    function checkPincodeLength(val) {
      const clean = val.replace(/[^0-9]/g, '');
      if (clean.length === 6) fetchLocationData(clean);
      else {
        fetchedCity = ''; fetchedState = '';
        document.getElementById('customerState').value = '';
        const locDisplay = document.getElementById('locationDisplay');
        const locText = document.getElementById('locationText');
        locDisplay.classList.remove('filled');
        locText.className = 'location-placeholder';
        locText.textContent = 'Auto-filled from pincode';
        calculateQuote();
      }
    }

    async function fetchLocationData(pincode) {
      const loader = document.getElementById('pincodeLoader');
      const locDisplay = document.getElementById('locationDisplay');
      const locText = document.getElementById('locationText');
      loader.style.display = 'block';
      loader.style.color = 'var(--teal)';
      loader.textContent = '🔍 Fetching location...';
      locDisplay.classList.remove('filled');
      locText.className = 'location-placeholder';
      locText.textContent = 'Fetching…';
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
        const data = await res.json();
        if (data[0]?.Status === 'Success') {
          const po = data[0].PostOffice[0];
          fetchedCity = po.District;
          fetchedState = po.State;
          // Set hidden state input
          document.getElementById('customerState').value = fetchedState;
          // Update location display
          locDisplay.classList.add('filled');
          locText.className = '';
          locText.innerHTML = `<span class="location-city">📍 ${fetchedCity}</span>&nbsp;<span class="location-state">· ${fetchedState}</span>`;
          loader.textContent = `✅ ${fetchedCity}, ${fetchedState}`;
          setTimeout(() => { loader.style.display = 'none'; }, 2000);
        } else {
          loader.style.color = '#DC2626';
          loader.textContent = '⚠️ Invalid Pincode. Please verify.';
          locDisplay.classList.remove('filled');
          locText.className = 'location-placeholder';
          locText.textContent = 'Auto-filled from pincode';
          document.getElementById('customerState').value = '';
          fetchedCity = ''; fetchedState = '';
        }
      } catch (e) {
        loader.style.color = '#DC2626';
        loader.textContent = '⚠️ Could not fetch pincode info.';
        locDisplay.classList.remove('filled');
        locText.className = 'location-placeholder';
        locText.textContent = 'Auto-filled from pincode';
      }
      calculateQuote();
    }

    /* ── HELPERS ── */
    const fmt = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);
    const fmtNum = (n) => new Intl.NumberFormat('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);
    const sanitize = (v, max = 80) => String(v || '').replace(/[^\w\s.,\-/#&()]/gi, '').trim().substring(0, max);

    function discountFor(qty) {
      if (qty >= 5000) return 40;
      if (qty >= 1000) return 25;
      if (qty >= 500) return 10;
      return 0;
    }

    /* ── MAIN CALCULATE ── */
    function calculateQuote() {
      // GST is mandatory on every order — always applied, regardless of any checkbox state.
      const includeGst = true;
      const cName = sanitize(document.getElementById('customerName').value, 60) || '—';
      const cNumber = sanitize(document.getElementById('customerNumber').value, 20) || '—';
      const cAddress = sanitize(document.getElementById('customerAddress').value, 120) || '—';
      const cPincode = document.getElementById('customerPincode').value.trim() || '—';
      const cGST = document.getElementById('customerGST').value.trim().toUpperCase();
      const stateEl = document.getElementById('customerState');
      const cState = stateEl.value || ''; // empty string = not selected

      /* Customer block */
      document.getElementById('outCustomerName').textContent = cName;
      document.getElementById('outCustomerNumber').textContent = cNumber;
      document.getElementById('outCustomerAddress').textContent = cAddress;
      document.getElementById('outCustomerPincode').textContent = cPincode;
      document.getElementById('outCustomerState').textContent = (fetchedCity && cState) ? `${fetchedCity}, ${cState}` : (cState || '—');

      const gstNumRow = document.getElementById('gstNumberRow');
      if (includeGst && cGST.length >= 15) {
        document.getElementById('outCustomerGST').textContent = cGST;
        gstNumRow.style.display = 'flex';
      } else {
        gstNumRow.style.display = 'none';
      }

      /* Build line items */
      const lineItems = [];
      let totalSubtotal = 0, totalDiscount = 0;

      [...selectedIds].forEach(id => {
        const p = PRODUCTS.find(x => x.id === id);
        const qty = p.fixed ? 1 : (quantities[id] || 0);
        if (qty <= 0) return;
        const disc = p.fixed ? 0 : discountFor(qty);
        const sub = p.price * qty;
        const discAmt = sub * disc / 100;
        const net = sub - discAmt;
        lineItems.push({ p, qty, sub, disc, discAmt, net });
        totalSubtotal += sub;
        totalDiscount += discAmt;
      });

      const netValue = totalSubtotal - totalDiscount;

      /* ── Shipping ── */
      let shippingCharge = 0;
      const pillEl = document.getElementById('shippingInfoPill');
      if (cState !== '') {
        const isMH = cState === 'Maharashtra';
        if (netValue >= 2000) {
          shippingCharge = 0;
          pillEl.style.display = 'inline-flex';
          pillEl.className = 'shipping-info-pill';
          pillEl.innerHTML = '🚚 Free shipping on this order!';
        } else {
          shippingCharge = isMH ? 40 : 80;
          pillEl.style.display = 'inline-flex';
          pillEl.className = 'shipping-info-pill paid';
          pillEl.innerHTML = isMH
            ? `📦 Maharashtra flat rate: ₹40`
            : `📦 Rest of India: ₹80`;
        }
      } else {
        pillEl.style.display = 'none';
      }

      /* ── GST ── */
      const gstAmount = includeGst ? Math.round(netValue * 0.18) : 0;
      const cgst = includeGst ? Math.round(netValue * 0.09) : 0;
      const sgst = includeGst ? Math.round(netValue * 0.09) : 0;
      const grandTotal = netValue + gstAmount + shippingCharge;

      /* ── Update totals ── */
      document.getElementById('outSubtotal').textContent = fmt(totalSubtotal);
      document.getElementById('outDiscountAmt').textContent = totalDiscount > 0 ? `− ${fmt(totalDiscount)}` : '— ₹0';
      document.getElementById('outNet').textContent = fmt(netValue);
      document.getElementById('outTotal').textContent = fmtNum(grandTotal);

      /* ── UPI limit notice (>1 lakh) ── */
      const upiNotice = document.getElementById('upiLimitNotice');
      if (grandTotal > 100000) {
        upiNotice.classList.add('show');
        // Auto-switch to bank tab
        switchPayTab('bank');
      } else {
        upiNotice.classList.remove('show');
      }

      /* ── Bank quote ref ── */
      document.getElementById('bankQuoteRef').textContent = quoteNum;

      /* Shipping row */
      const shRow = document.getElementById('shippingRow');
      const outSh = document.getElementById('outShipping');
      if (cState !== '') {
        shRow.style.display = 'flex';
        outSh.textContent = shippingCharge === 0 ? 'FREE 🚚' : `+ ${fmt(shippingCharge)}`;
        outSh.style.color = shippingCharge === 0 ? 'var(--green)' : '';
        shRow.className = shippingCharge === 0 ? 'qt-line shipping-free' : 'qt-line';
      } else {
        shRow.style.display = 'none';
      }

      /* GST row + breakdown */
      const gstRow = document.getElementById('gstRow');
      const gstBreakdown = document.getElementById('gstBreakdown');
      if (includeGst && netValue > 0) {
        gstRow.style.display = 'flex';
        document.getElementById('outGst').textContent = `+ ${fmt(gstAmount)}`;
        document.getElementById('outCgst').textContent = fmt(cgst);
        document.getElementById('outSgst').textContent = fmt(sgst);
        gstBreakdown.classList.add('visible');
      } else {
        gstRow.style.display = 'none';
        gstBreakdown.classList.remove('visible');
      }

      /* ── Items table ── */
      const wrap = document.getElementById('itemsTableWrap');
      if (lineItems.length === 0) {
        wrap.innerHTML = `<div style="text-align:center;color:var(--ink-3);font-size:13px;padding:20px 0;">No products selected yet.</div>`;
      } else {
        wrap.innerHTML = `
        <table class="q-items-table">
          <thead><tr>
            <th>Product</th><th>Qty</th><th>Rate</th><th>Amount</th>
          </tr></thead>
          <tbody>
            ${lineItems.map(li => `
              <tr>
                <td>
                  <div class="td-name">${li.p.name}</div>
                  <div class="td-sub">${li.p.fixed
            ? li.p.fixedLabel
            : li.p.code + (li.disc > 0 ? ` &nbsp;·&nbsp; <span style="color:var(--green);font-weight:700;">${li.disc}% off</span>` : '')
          }</div>
                </td>
                <td>${li.p.fixed ? '1 kit' : li.qty.toLocaleString('en-IN')}</td>
                <td>${li.p.fixed ? fmt(li.p.price) + '/kit' : fmt(li.p.price) + '/pc'}</td>
                <td>${fmt(li.net)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
      }

      /* ── UPI ── */
      const upiVpa = '87222401@ubin';
      const merchant = 'Sanjivani Chavan';
      const upiNote = `Order ${[...selectedIds].map(id => id.substring(0, 4)).join('+')} ${cPincode.replace(/\D/g, '').substring(0, 6) || '000000'}`.substring(0, 50);
      const upiParams = new URLSearchParams({ pa: upiVpa, pn: merchant, am: grandTotal.toFixed(2), cu: 'INR', tn: upiNote });
      const upiString = `upi://pay?${upiParams.toString()}`;
      document.getElementById('upiLink').href = upiString;
      qrcodeContainer.clear();
      if (grandTotal > 0) qrcodeContainer.makeCode(upiString);

      /* ── WhatsApp ── */
      const itemLines = lineItems.map(li =>
        `• ${li.p.name} (${li.p.code}) × ${li.p.fixed ? '1 kit (70 pcs)' : li.qty.toLocaleString('en-IN') + ' pcs'} @ ${fmt(li.p.price)}/${li.p.fixed ? 'kit' : 'pc'}` +
        (li.disc > 0 ? ` [-${li.disc}%]` : '') + ` = ${fmt(li.net)}`
      ).join('\n');

      const gstLine = includeGst
        ? `GST (18%): + ${fmt(gstAmount)}\n  CGST (9%): ${fmt(cgst)}\n  SGST (9%): ${fmt(sgst)}`
        : `GST: Not Applied`;

      const waMsg = `Hello,

I would like to proceed with the following bulk order quotation.

QUOTATION REF: ${quoteNum}
DATE: ${fmtDate(now)}

CUSTOMER DETAILS
Name: ${cName}
Phone: ${cNumber}
Address: ${cAddress}
Pincode: ${cPincode}
State: ${cState || '—'}${cGST.length >= 15 ? `\nGST Number: ${cGST}` : ''}

ORDER ITEMS
${itemLines || '(no items)'}

SUMMARY
Subtotal:       ${fmt(totalSubtotal)}
Bulk Discount:  - ${fmt(totalDiscount)}
Net Value:      ${fmt(netValue)}
Shipping:       ${cState && shippingCharge === 0 ? 'FREE' : (cState ? fmt(shippingCharge) : 'TBD')}
${gstLine}
─────────────────────
Grand Total:    ${fmt(grandTotal)}

Please share the next steps for confirmation and dispatch.`;

      document.getElementById('waLink').href = `https://wa.me/919960160016?text=${encodeURIComponent(waMsg)}`;
    }

    /* ── PAYMENT TAB SWITCH ── */
    function switchPayTab(tab) {
      document.getElementById('tabUpi').classList.toggle('active', tab === 'upi');
      document.getElementById('tabBank').classList.toggle('active', tab === 'bank');
      document.getElementById('panelUpi').classList.toggle('active', tab === 'upi');
      document.getElementById('panelBank').classList.toggle('active', tab === 'bank');
    }

    /* ── COPY BANK DETAIL ── */
    function copyBankDetail(btn, text) {
      navigator.clipboard.writeText(text).then(() => {
        btn.textContent = '✓ Copied';
        btn.classList.add('copied');
        setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 1800);
      }).catch(() => {
        // Fallback
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        btn.textContent = '✓ Copied';
        btn.classList.add('copied');
        setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 1800);
      });
    }

    /* ── INIT ── */
    renderGrid();
    calculateQuote();
