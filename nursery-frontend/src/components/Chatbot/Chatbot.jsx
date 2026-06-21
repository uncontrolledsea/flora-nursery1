import React, { useState, useRef, useEffect } from 'react';
import { Leaf, X, Send, Bot } from 'lucide-react';

const RESPONSES = {
  greet: 'Hello! Welcome to FloraNursery! How can I help you today?',
  water: 'Most indoor plants need watering once or twice a week. Always check the soil first - if the top inch is dry, it is time to water.',
  sunlight: 'Most indoor plants prefer bright indirect sunlight. Avoid direct afternoon sun which can burn leaves.',
  fertilize: 'Fertilize your plants every 2-4 weeks during spring and summer with a balanced liquid fertilizer. Reduce in winter.',
  repot: 'Repot when roots start coming out of drainage holes, usually every 1-2 years. Choose a pot 2 inches larger.',
  yellow: 'Yellow leaves can mean overwatering, underwatering, or nutrient deficiency. Check soil moisture first.',
  brown: 'Brown tips usually mean low humidity or fluoride in tap water. Try misting leaves or using filtered water.',
  indoor: 'Great indoor plants: Money Plant, Snake Plant, Peace Lily, Areca Palm. All are low maintenance.',
  outdoor: 'Great outdoor plants: Hibiscus, Neem, Bougainvillea. They need good sunlight and regular watering.',
  medicinal: 'Popular medicinal plants: Tulsi, Aloe Vera, Neem, Mint. Great for home gardens.',
  beginner: 'Best plants for beginners: Money Plant, Snake Plant, Aloe Vera. All very forgiving and low maintenance.',
  default: 'I am not sure about that. Try asking about watering, sunlight, fertilizing, or specific plant types.',
};

function getBotReply(msg) {
  const m = msg.toLowerCase();
  if (m.match(/hi|hello|hey|namaste/)) return RESPONSES.greet;
  if (m.match(/water|irrigation|drink/)) return RESPONSES.water;
  if (m.match(/sun|light|shade/)) return RESPONSES.sunlight;
  if (m.match(/fertili|feed|nutrient/)) return RESPONSES.fertilize;
  if (m.match(/repot|pot|transplant/)) return RESPONSES.repot;
  if (m.match(/yellow/)) return RESPONSES.yellow;
  if (m.match(/brown|tip|dry/)) return RESPONSES.brown;
  if (m.match(/indoor|inside|home/)) return RESPONSES.indoor;
  if (m.match(/outdoor|outside|garden/)) return RESPONSES.outdoor;
  if (m.match(/medicin|herb|ayurved/)) return RESPONSES.medicinal;
  if (m.match(/beginner|easy|start|new/)) return RESPONSES.beginner;
  return RESPONSES.default;
}

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hi! I am Flora, your plant care assistant. Ask me about watering, sunlight, or plant types.' }
  ]);
  const [input, setInput] = useState('');
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages(prev => [...prev, { from: 'user', text: userMsg }]);
    setInput('');
    setTimeout(() => setMessages(prev => [...prev, { from: 'bot', text: getBotReply(userMsg) }]), 450);
  };

  return (
    <>
      <button className="chatbot-toggle" onClick={() => setOpen(o => !o)} title="Plant Care Assistant">
        {open ? <X size={22} /> : <Leaf size={24} />}
      </button>
      {open && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Bot size={19} />
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>Flora</div>
                <div style={{ fontSize: '0.7rem', opacity: 0.85 }}>Plant Care Assistant</div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
              <X size={17} />
            </button>
          </div>
          <div className="chatbot-messages">
            {messages.map((m, i) => <div key={i} className={`chat-msg ${m.from}`}>{m.text}</div>)}
            <div ref={endRef} />
          </div>
          <div className="chatbot-input">
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="Ask about plant care..." />
            <button onClick={send}><Send size={15} /></button>
          </div>
        </div>
      )}
    </>
  );
}
