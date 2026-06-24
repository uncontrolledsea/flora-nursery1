import React, { useState, useRef, useEffect } from 'react';
import { Leaf, X, Send, Bot, ShieldAlert, Sparkles, ShoppingBag, Check } from 'lucide-react';
import { inferPlant, diagnoseSymptom } from '../../utils/chatbotEngine';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const SYMPTOMS = ['Yellow Leaves', 'Brown Spots', 'Root Rot', 'Wilting', 'Drooping Leaves', 'Pest Attack'];

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'diagnostic'
  
  // Chat state
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hi! I am Flora, your AI Botanical Expert. Ask me about watering, soil, sunlight, or a specific plant care guide (e.g. Tulsi, Aloe, Neem, Cactus).' }
  ]);
  const [input, setInput] = useState('');
  const endRef = useRef(null);

  // Diagnostic State
  const [selectedSymptom, setSelectedSymptom] = useState('');
  const [diagnosisResult, setDiagnosisResult] = useState(null);

  const navigate = useNavigate();

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages(prev => [...prev, { from: 'user', text: userMsg }]);
    setInput('');

    // Run rule-based inference engine
    setTimeout(() => {
      const inference = inferPlant(userMsg);
      const answerHtml = (
        <div style={{ fontSize: '0.85rem' }}>
          <div dangerouslySetInnerHTML={{ __html: inference.answer }} />
          <div style={{ marginTop: '0.4rem', paddingTop: '0.4rem', borderTop: '1px dashed rgba(45,106,79,0.2)', fontSize: '0.75rem', fontStyle: 'italic', color: 'var(--green)' }}>
            <strong>Reasoning:</strong> {inference.explanation}
          </div>
        </div>
      );
      setMessages(prev => [...prev, { from: 'bot', text: answerHtml }]);
    }, 400);
  };

  const handleDiagnose = (symptom) => {
    setSelectedSymptom(symptom);
    const result = diagnoseSymptom(symptom);
    setDiagnosisResult(result);
    toast.success(`Completed diagnostic mapping for: ${symptom}`);
  };

  const handleProductRedirect = (prodName) => {
    setOpen(false);
    navigate(`/?search=${encodeURIComponent(prodName)}`);
    toast.success(`Searching catalog for: ${prodName}`);
  };

  return (
    <>
      <button className="chatbot-toggle" onClick={() => setOpen(o => !o)} title="Flora AI Care Assistant" style={{ zIndex: 1000 }}>
        {open ? <X size={22} /> : <Leaf size={24} />}
      </button>

      {open && (
        <div className="chatbot-window" style={{ width: '360px', maxHeight: '550px', height: '520px', zIndex: 999, display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <div className="chatbot-header" style={{ padding: '0.8rem 1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Bot size={20} />
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.92rem', lineHeight: 1.1 }}>Flora AI</div>
                <div style={{ fontSize: '0.7rem', opacity: 0.85 }}>Botanical Expert & Diagnostics</div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
              <X size={17} />
            </button>
          </div>

          {/* Assistant Sub-navigation Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid #eee', background: '#f8faf9', fontSize: '0.82rem' }}>
            <button onClick={() => setActiveTab('chat')} style={{ flex: 1, padding: '0.6rem', border: 'none', background: activeTab === 'chat' ? 'white' : 'transparent', borderBottom: activeTab === 'chat' ? '2px solid var(--green)' : 'none', fontWeight: activeTab === 'chat' ? 700 : 500, cursor: 'pointer', color: activeTab === 'chat' ? 'var(--green)' : 'var(--gray)' }}>
              Botanical Chatbot
            </button>
            <button onClick={() => setActiveTab('diagnostic')} style={{ flex: 1, padding: '0.6rem', border: 'none', background: activeTab === 'diagnostic' ? 'white' : 'transparent', borderBottom: activeTab === 'diagnostic' ? '2px solid var(--green)' : 'none', fontWeight: activeTab === 'diagnostic' ? 700 : 500, cursor: 'pointer', color: activeTab === 'diagnostic' ? 'var(--green)' : 'var(--gray)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
              <ShieldAlert size={14} /> Health Diagnostic
            </button>
          </div>

          {/* Tab 1: Chatbot Assistant */}
          {activeTab === 'chat' && (
            <>
              <div className="chatbot-messages" style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {messages.map((m, i) => (
                  <div key={i} className={`chat-msg ${m.from}`} style={{ padding: '0.6rem 0.8rem', borderRadius: 10, maxWidth: '85%', fontSize: '0.83rem', alignSelf: m.from === 'bot' ? 'flex-start' : 'flex-end', background: m.from === 'bot' ? 'var(--green-pale)' : 'var(--green)', color: m.from === 'bot' ? 'var(--dark)' : 'white' }}>
                    {typeof m.text === 'string' ? m.text : m.text}
                  </div>
                ))}
                <div ref={endRef} />
              </div>
              <div className="chatbot-input" style={{ borderTop: '1px solid #eee', padding: '0.6rem', display: 'flex', gap: 6 }}>
                <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder="Ask me a plant care question..." style={{ flex: 1, padding: '0.5rem 0.8rem', borderRadius: 20, border: '1px solid #ddd', fontSize: '0.82rem', outline: 'none' }} />
                <button onClick={handleSend} style={{ background: 'var(--green)', color: 'white', border: 'none', borderRadius: '50%', width: 34, height: 34, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyCenter: 'center' }}><Send size={14} style={{ margin: 'auto' }} /></button>
              </div>
            </>
          )}

          {/* Tab 2: Plant Health Diagnostic Assistant */}
          {activeTab === 'diagnostic' && (
            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <h4 style={{ color: 'var(--dark)', fontSize: '0.88rem', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Sparkles size={14} color="var(--orange)" /> Select a Care Symptom
                </h4>
                <p style={{ color: 'var(--gray)', fontSize: '0.75rem', lineHeight: 1.4, marginBottom: '0.8rem' }}>
                  Choose a leaf or root symptom to perform a rule-based expert diagnosis.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6 }}>
                  {SYMPTOMS.map(sym => (
                    <button key={sym} onClick={() => handleDiagnose(sym)} style={{ padding: '0.5rem 0.4rem', fontSize: '0.78rem', background: selectedSymptom === sym ? 'var(--green-pale)' : 'white', border: selectedSymptom === sym ? '2px solid var(--green)' : '1px solid #ddd', borderRadius: '6px', cursor: 'pointer', textAlign: 'center', fontWeight: selectedSymptom === sym ? 600 : 'normal', transition: 'all 0.15s' }}>
                      {sym}
                    </button>
                  ))}
                </div>
              </div>

              {/* Diagnosis Result Card */}
              {diagnosisResult ? (
                <div style={{ background: '#fdfdfd', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.9rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                  <h4 style={{ color: 'var(--red)', fontSize: '0.85rem', marginBottom: '0.6rem', borderBottom: '1px solid #edf2f7', paddingBottom: '0.3rem' }}>
                    Diagnosis Card: {diagnosisResult.symptom}
                  </h4>

                  {/* Causes List with Probability */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '0.8rem' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 'bold', color: 'var(--dark)' }}>Possible Causes:</span>
                    {diagnosisResult.possibleCauses.map((cause, i) => (
                      <div key={i} style={{ fontSize: '0.8rem', background: '#f7fafc', padding: '0.5rem', borderRadius: 6 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                          <span>{cause.name}</span>
                          <span style={{ color: 'var(--orange)' }}>{cause.probability}% Prob.</span>
                        </div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--gray)', marginTop: '0.2rem' }}>
                          <strong>Treatment:</strong> {cause.treatment}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--green)', marginTop: '0.1rem' }}>
                          <strong>Prevention:</strong> {cause.prevention}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Recommended Products */}
                  <div style={{ borderTop: '1px solid #edf2f7', paddingTop: '0.6rem' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 'bold', color: 'var(--dark)', display: 'block', marginBottom: '0.4rem' }}>
                      Recommended Products & Plants:
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {diagnosisResult.recommendedProducts.map((prod, i) => (
                        <button key={i} onClick={() => handleProductRedirect(prod)} style={{ display: 'flex', alignItems: 'center', gap: 6, width: '100%', background: 'none', border: 'none', color: 'var(--green)', cursor: 'pointer', textAlign: 'left', fontSize: '0.78rem', padding: '0.2rem 0.4rem', borderRadius: '4px', textDecoration: 'underline' }}>
                          <ShoppingBag size={12} /> {prod}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ background: '#f8faf9', border: '1px dashed #cbd5e0', padding: '2rem 1rem', borderRadius: 8, textAlign: 'center', color: 'var(--gray)', fontSize: '0.78rem' }}>
                  No symptom selected. Select a symptom above to generate AI diagnosis.
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}
