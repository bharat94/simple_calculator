(() => {
  const displayEl = document.getElementById('display')
  let lhs = ''
  let rhs = ''
  let op = null
  let enteringRhs = false

  function render() {
    if (!lhs) displayEl.textContent = '0'
    else if (!enteringRhs) displayEl.textContent = lhs
    else displayEl.textContent = rhs || '0'
  }

  function clearAll() { lhs = ''; rhs = ''; op = null; enteringRhs = false; render(); }

  function pressNum(n) {
    if (!enteringRhs) {
      if (n === '.' && lhs.includes('.')) return
      lhs = (lhs === '0' && n !== '.') ? String(n) : lhs + String(n)
    } else {
      if (n === '.' && rhs.includes('.')) return
      rhs = (rhs === '0' && n !== '.') ? String(n) : rhs + String(n)
    }
    render()
  }

  function pressOp(newOp) {
    if (!lhs) return
    if (enteringRhs && rhs) {
      // perform intermediate compute
      computeAndSet(lhs, rhs, op)
    }
    op = newOp
    enteringRhs = true
    render()
  }

  async function computeAndSet(aStr, bStr, opStr) {
    try {
      const a = parseFloat(aStr)
      const b = parseFloat(bStr)
      const payload = { a, b, op: opStr }
      const resEl = document.getElementById('display')
      resEl.textContent = '…'
      const r = await fetch('/api/calc', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
      })
      const j = await r.json()
      if (!r.ok) {
        resEl.textContent = j.error || 'Error'
        lhs = ''
        rhs = ''
        op = null
        enteringRhs = false
        return
      }
      const result = String(j.result)
      lhs = result
      rhs = ''
      enteringRhs = false
      op = null
      render()
    } catch (err) {
      displayEl.textContent = 'Network error'
    }
  }

  function equals() {
    if (!lhs || !op || !rhs) return
    computeAndSet(lhs, rhs, op)
  }

  function percent() {
    if (enteringRhs) rhs = String((parseFloat(rhs || '0') || 0) / 100)
    else lhs = String((parseFloat(lhs || '0') || 0) / 100)
    render()
  }

  function signToggle() {
    if (enteringRhs) rhs = String(-1 * (parseFloat(rhs || '0') || 0))
    else lhs = String(-1 * (parseFloat(lhs || '0') || 0))
    render()
  }

  // attach button handlers
  document.querySelectorAll('[data-num]').forEach(btn => {
    btn.addEventListener('click', () => pressNum(btn.dataset.num))
  })
  document.querySelectorAll('[data-op]').forEach(btn => btn.addEventListener('click', () => pressOp(btn.dataset.op)))
  document.querySelectorAll('[data-action]').forEach(btn => {
    const a = btn.dataset.action
    btn.addEventListener('click', () => {
      if (a === 'clear') clearAll()
      else if (a === 'equals') equals()
      else if (a === 'percent') percent()
      else if (a === 'sign') signToggle()
    })
  })

  // keyboard support
  window.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') pressNum(e.key)
    else if (e.key === '.') pressNum('.')
    else if (e.key === '+') pressOp('add')
    else if (e.key === '-') pressOp('sub')
    else if (e.key === '*') pressOp('mul')
    else if (e.key === '/') pressOp('div')
    else if (e.key === 'Enter' || e.key === '=') equals()
    else if (e.key === 'Backspace') {
      if (enteringRhs) rhs = rhs.slice(0, -1)
      else lhs = lhs.slice(0, -1)
      render()
    }
  })

  // initial
  clearAll()
})();
