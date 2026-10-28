import { useMemo, useState } from 'react'
import { ArrowDown, ArrowRight, Calculator, CarFront, Check, ChevronDown, CircleHelp, Download, Info, Menu, Printer, RotateCcw, ShieldCheck, Sparkles, Wallet } from 'lucide-react'

const euro = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' })
const money = value => euro.format(value)
const dateText = date => new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date)

function buildPlan(principal, annualRate, months, balloon) {
  const monthlyRate = annualRate / 100 / 12
  const residual = Math.min(principal, Math.max(0, balloon))
  const regular = monthlyRate === 0 ? (principal - residual) / months : (principal - residual / (1 + monthlyRate) ** months) * monthlyRate / (1 - (1 + monthlyRate) ** -months)
  let balance = principal
  const firstDue = new Date()
  firstDue.setMonth(firstDue.getMonth() + 1)
  firstDue.setDate(1)
  const regularPayments = Array.from({ length: months }, (_, index) => {
    const interest = balance * monthlyRate
    const installment = regular
    const capital = installment - interest
    balance = Math.max(0, balance - capital)
    const due = new Date(firstDue)
    due.setMonth(due.getMonth() + index)
    return { number: index + 1, due, installment, capital, interest, balance }
  })
  return regularPayments
}

function Field({ label, value, onChange, prefix, suffix, min, max, step = 1, helper }) {
  return <label className="field"><span className="field-label">{label}</span><span className="input-wrap">{prefix && <span className="input-affix">{prefix}</span>}<input type="number" inputMode="decimal" min={min} max={max} step={step} value={value} onChange={event => onChange(event.target.value)} />{suffix && <span className="input-affix">{suffix}</span>}</span>{helper && <span className="field-helper">{helper}</span>}</label>
}

export default function App() {
  const [amount, setAmount] = useState('18000')
  const [rate, setRate] = useState('6.95')
  const [months, setMonths] = useState('60')
  const [balloonAmount, setBalloonAmount] = useState('0')
  const [tradeValue, setTradeValue] = useState('')
  const [activeTab, setActiveTab] = useState('resumen')
  const [menuOpen, setMenuOpen] = useState(false)
  const principal = Math.max(0, Number(amount) || 0)
  const annualRate = Math.max(0, Number(rate) || 0)
  const term = Math.min(120, Math.max(1, Math.round(Number(months) || 1)))
  const balloon = Math.min(principal, Math.max(0, Number(balloonAmount) || 0))
  const valuation = Math.max(0, Number(tradeValue) || 0)
  const renewalDifference = valuation > 0 ? valuation - balloon : null
  const plan = useMemo(() => principal > 0 ? buildPlan(principal, annualRate, term, balloon) : [], [principal, annualRate, term, balloon])
  const monthlyPayment = plan[0]?.installment || 0
  const totalInterest = plan.reduce((sum, row) => sum + row.interest, 0)
  const totalToPay = plan.reduce((sum, row) => sum + row.installment, 0)

  const reset = () => { setAmount('18000'); setRate('6.95'); setMonths('60'); setBalloonAmount('0'); setTradeValue('') }
  const exportCsv = () => {
    const header = ['Vencimiento', 'Importe del recibo', 'Amortización de capital', 'Intereses', 'Capital pendiente']
    const body = plan.map(row => [dateText(row.due), row.installment.toFixed(2), row.capital.toFixed(2), row.interest.toFixed(2), row.balance.toFixed(2)])
    const csv = [header, ...body].map(row => row.map(cell => `"${cell}"`).join(';')).join('\n')
    const link = document.createElement('a')
    link.href = URL.createObjectURL(new Blob(['\ufeff', csv], { type: 'text/csv;charset=utf-8' }))
    link.download = 'simulacion-compostela-movil.csv'
    link.click()
    URL.revokeObjectURL(link.href)
  }

  return <div className="app-shell">
    <header className="site-header"><div className="identity-bar"><a className="dealer-brand" href="https://compostelamovil.com/" target="_blank" rel="noreferrer" aria-label="Compostela Móvil, concesionario oficial Toyota"><span className="toyota-mark" aria-label="Toyota"><svg viewBox="0 0 70 48" role="img"><ellipse cx="35" cy="24" rx="31" ry="20"/><ellipse cx="35" cy="24" rx="12" ry="19"/><ellipse cx="35" cy="19" rx="28" ry="10"/></svg></span><span className="dealer-divider"/><span className="dealer-name">COMPOSTELA MOVIL, S.A.U.</span></a><a className="dealer-phone" href="tel:+34623827634">+34 623 82 76 34 <ArrowRight size={13} /></a></div><nav className={menuOpen ? 'dealer-nav open' : 'dealer-nav'}><div className="dealer-nav-inner"><a href="https://compostelamovil.com/" target="_blank" rel="noreferrer">Inicio</a><a href="https://compostelamovil.com/vehiculos-ocasion/" target="_blank" rel="noreferrer">Vehículos de ocasión</a><a href="https://compostelamovil.com/empresas/" target="_blank" rel="noreferrer">Empresas</a><a href="https://compostelamovil.com/renting/" target="_blank" rel="noreferrer">Renting</a><a href="#simulador">Herramientas</a><button className="dealer-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Abrir menú"><Menu size={19} /></button></div></nav></header>

    <main id="inicio"><section className="hero"><div className="hero-content"><div className="eyebrow"><span className="eyebrow-dot" /> TU PRÓXIMO TOYOTA, A TU MANERA</div><h1>Decisiones claras.<br /><span>Viajes que empiezan.</span></h1><p>Diseña una financiación a tu medida y descubre, con total claridad, cada cuota de tu próximo Toyota.</p><a className="hero-link" href="#simulador">Crear mi simulación <ArrowDown size={15} /></a></div><div className="hero-art" aria-hidden="true"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><span className="hero-number">01 <i>/ 03</i></span><div className="art-card"><CarFront size={24} strokeWidth={1.4} /><span>Tu próximo<br />destino empieza aquí</span></div><div className="art-glow" /></div><div className="hero-foot"><span>SANTIAGO DE COMPOSTELA · GALICIA</span><span>UN ESPACIO PARA ELEGIR CON CALMA <span className="foot-line" /></span></div></section>

    <section className="workspace" id="simulador"><div className="section-heading"><div><div className="section-kicker">HERRAMIENTA 01 <span>—</span> FINANCIACIÓN</div><h2>Un plan que encaja <em>contigo.</em></h2><p>Ajusta los datos y explora la propuesta que mejor acompaña tu camino.</p></div><div className="secure-note"><ShieldCheck size={16} /><span>Simulación privada<br /><small>Tus datos se quedan aquí</small></span></div></div>

      <div className="calculator-layout"><section className="input-card"><div className="card-heading"><div className="icon-box"><Calculator size={18} /></div><div><h3>Configura tu financiación</h3><p>Importe, interés, cuotas y valor garantizado</p></div><button className="reset-button" onClick={reset} title="Restablecer"><RotateCcw size={16} /></button></div><div className="fields"><Field label="Importe a financiar" value={amount} onChange={setAmount} prefix="€" min="1" step="100" helper="Cantidad del préstamo, sin incluir entrada." /><div className="field-row"><Field label="Interés nominal anual (TIN)" value={rate} onChange={setRate} suffix="%" min="0" max="100" step="0.05" /><Field label="Cuotas mensuales" value={months} onChange={setMonths} suffix="cuotas" min="1" max="120" helper={balloon > 0 ? 'Al final quedará el valor garantizado pendiente.' : undefined} /></div><div className="balloon-row"><Field label="Valor futuro garantizado" value={balloonAmount} onChange={setBalloonAmount} prefix="€" min="0" max={amount} step="100" helper="Importe pendiente al acabar las cuotas." /><Field label="Tasación prevista al final" value={tradeValue} onChange={setTradeValue} prefix="€" min="0" step="100" helper="Opcional: sirve para calcular la aportación al renovar." /></div><div className="term-presets"><span>Cuotas habituales</span>{[36, 48, 60, 72].map(value => <button key={value} className={term === value ? 'preset active' : 'preset'} onClick={() => setMonths(String(value))}>{value}</button>)}</div></div><div className="estimate-note"><Info size={15} /><span>El valor garantizado queda pendiente al final. Si la tasación es mayor, la diferencia puede aplicarse a la renovación.</span></div></section>

      <section className="result-card"><div className="result-top"><span className="result-label"><Sparkles size={14} /> TU PROPUESTA ORIENTATIVA</span><span className="result-tag">{balloon > 0 ? 'VALOR GARANTIZADO' : 'PERSONALIZABLE'}</span></div><div className="monthly"><span>Cuota mensual orientativa</span><div>{money(monthlyPayment).replace(/\s?€/, '')}<small> €</small></div><p>{balloon > 0 ? <>{term} cuotas · pendiente al final: {money(balloon)} <span>·</span></> : <>durante {term} meses <span>·</span></>} TIN {annualRate.toLocaleString('es-ES', { maximumFractionDigits: 2 })}%</p></div><div className="result-divider" /><div className="result-stats"><div><span>Importe financiado</span><strong>{money(principal)}</strong></div><div><span>Pendiente al final</span><strong>{balloon > 0 ? money(balloon) : money(0)}</strong></div><div><span>{renewalDifference === null ? 'Intereses estimados' : renewalDifference >= 0 ? 'Para renovar' : 'Diferencia pendiente'}</span><strong>{renewalDifference === null ? money(totalInterest) : money(Math.abs(renewalDifference))}</strong></div></div><div className="result-footer"><div className="avatar-stack"><span>CM</span></div><span>¿Lo vemos juntos?<br /><small>Estamos aquí para ayudarte</small></span><a href="tel:+34623827634" aria-label="Llamar al concesionario"><ArrowRight size={17} /></a></div></section></div>

      <section className="schedule-section"><div className="schedule-top"><div><div className="section-kicker">DETALLE DEL PLAN</div><h3>Así evoluciona tu financiación</h3><p>Consulta cada recibo y cuánto capital te queda por amortizar.</p></div><div className="schedule-actions"><button className="action-button" onClick={exportCsv}><Download size={15} /> Descargar CSV</button><button className="action-button print-action" onClick={() => window.print()}><Printer size={15} /> Imprimir</button></div></div><div className="table-toolbar"><div className="table-tabs"><button className={activeTab === 'resumen' ? 'table-tab active' : 'table-tab'} onClick={() => setActiveTab('resumen')}>Primeras cuotas</button><button className={activeTab === 'completo' ? 'table-tab active' : 'table-tab'} onClick={() => setActiveTab('completo')}>Plan completo <span>{plan.length}</span></button></div><span className="table-caption"><CircleHelp size={14} /> Importes en euros</span></div><div className="table-scroll"><table><thead><tr><th>N.º</th><th>Vencimiento</th><th>Importe recibo</th><th>Amort. capital</th><th>Intereses</th><th>Capital pendiente</th></tr></thead><tbody>{(activeTab === 'resumen' ? plan.slice(0, 8) : plan).map(row => <tr key={row.number}><td className="row-number">{String(row.number).padStart(2, '0')}</td><td>{dateText(row.due)}</td><td className="amount-cell">{money(row.installment)}</td><td>{money(row.capital)}</td><td>{money(row.interest)}</td><td className="balance-cell">{money(row.balance)}</td></tr>)}</tbody></table></div><div className="table-bottom"><span>Simulación orientativa · Sistema francés{balloon > 0 ? ` · Al final quedan ${money(balloon)} pendientes para renovar, entregar o quedarte el coche.` : '.'}</span><button onClick={() => { setActiveTab(activeTab === 'resumen' ? 'completo' : 'resumen') }}>{activeTab === 'resumen' ? <>Ver las {plan.length} cuotas <ChevronDown size={15} /></> : <>Ver primeras cuotas <ChevronDown size={15} className="rotate-up" /></>}</button></div></section>

      <section className="advisor-banner"><div className="advisor-icon"><CarFront size={21} /></div><div><strong>¿Quieres convertir esta simulación en una propuesta real?</strong><p>Hablemos de tu próximo Toyota. Nuestro equipo te acompaña paso a paso.</p></div><a href="tel:+34623827634">Hablemos <ArrowRight size={15} /></a></section>
      <div className="disclaimer"><Info size={14} /><p>Esta herramienta ofrece una estimación orientativa y no constituye una oferta vinculante ni una aprobación de financiación. La cuota definitiva, el TIN, la TAE y el coste total dependerán de la evaluación de la entidad financiera, las comisiones, productos opcionales y condiciones vigentes. Consulta la información precontractual antes de contratar.</p></div>
    </section></main><footer className="footer"><a className="footer-dealer" href="https://compostelamovil.com/" target="_blank" rel="noreferrer"><span className="toyota-mark" aria-label="Toyota"><svg viewBox="0 0 70 48" role="img"><ellipse cx="35" cy="24" rx="31" ry="20"/><ellipse cx="35" cy="24" rx="12" ry="19"/><ellipse cx="35" cy="19" rx="28" ry="10"/></svg></span><span className="dealer-divider"/><span className="dealer-name">COMPOSTELA MOVIL, S.A.U.</span></a><span>TRAVESÍA DE REBORIDO 13 · TEO, SANTIAGO DE COMPOSTELA</span><a href="https://compostelamovil.com/" target="_blank" rel="noreferrer">COMPOSTELAMOVIL.COM <ArrowRight size={12} /></a></footer>
  </div>
}
