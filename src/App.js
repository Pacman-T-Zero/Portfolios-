import React, { useState, useEffect, useRef } from 'react';
import './App.css';

// Fractal Generator Component
const FractalExplorer = () => {
  const canvasRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [iterations, setIterations] = useState(50);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Draw Mandelbrot set
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const cx = (x - width / 2) / (width / 4) / zoom - 0.5;
        const cy = (y - height / 2) / (height / 4) / zoom;
        
        let zx = 0, zy = 0;
        let i = 0;
        
        while (zx * zx + zy * zy < 4 && i < iterations) {
          const temp = zx * zx - zy * zy + cx;
          zy = 2 * zx * zy + cy;
          zx = temp;
          i++;
        }
        
        const hue = (i / iterations) * 360;
        const saturation = i < iterations ? 100 : 0;
        const lightness = i < iterations ? 50 : 0;
        
        ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }, [zoom, iterations]);
  
  return (
    <div className="fractal-section">
      <div className="section-label">01 — Fractals</div>
      <h3>Mandelbrot Set Explorer</h3>
      <p className="subtitle">Complexity emerging from simplicity. Adjust the controls to dive deeper.</p>
      
      <canvas 
        ref={canvasRef} 
        width={400} 
        height={400}
        className="fractal-canvas"
      />
      
      <div className="controls">
        <div className="control-group">
          <label>Zoom: {zoom.toFixed(1)}x</label>
          <input 
            type="range" 
            min="1" 
            max="10" 
            step="0.5"
            value={zoom}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
          />
        </div>
        <div className="control-group">
          <label>Iterations: {iterations}</label>
          <input 
            type="range" 
            min="10" 
            max="150" 
            step="10"
            value={iterations}
            onChange={(e) => setIterations(parseInt(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
};

// Probability Simulator
const ProbabilitySimulator = () => {
  const [trials, setTrials] = useState(0);
  const [heads, setHeads] = useState(0);
  const [history, setHistory] = useState([]);
  
  const runTrial = () => {
    const result = Math.random() > 0.5;
    setTrials(t => t + 1);
    if (result) setHeads(h => h + 1);
    
    const newRatio = result ? (heads + 1) / (trials + 1) : heads / (trials + 1);
    setHistory(h => [...h.slice(-50), newRatio]);
  };
  
  const runMany = () => {
    for (let i = 0; i < 100; i++) {
      setTimeout(() => runTrial(), i * 10);
    }
  };
  
  const reset = () => {
    setTrials(0);
    setHeads(0);
    setHistory([]);
  };
  
  const probability = trials > 0 ? (heads / trials).toFixed(4) : 0;
  
  return (
    <div className="probability-section">
      <div className="section-label">02 — Probability</div>
      <h3>Law of Large Numbers</h3>
      <p className="subtitle">Watch probability converge to theory in real-time</p>
      
      <div className="prob-stats">
        <div className="stat">
          <div className="stat-value">{trials}</div>
          <div className="stat-label">Total Flips</div>
        </div>
        <div className="stat">
          <div className="stat-value">{probability}</div>
          <div className="stat-label">P(Heads)</div>
        </div>
        <div className="stat highlight">
          <div className="stat-value">{Math.abs(probability - 0.5).toFixed(4)}</div>
          <div className="stat-label">Distance from 0.5</div>
        </div>
      </div>
      
      <div className="prob-viz">
        {history.map((val, i) => (
          <div 
            key={i} 
            className="prob-bar"
            style={{
              height: `${Math.abs(val - 0.5) * 500}px`,
              backgroundColor: `hsl(${220 - Math.abs(val - 0.5) * 500}, 70%, 60%)`
            }}
          />
        ))}
      </div>
      
      <div className="controls">
        <button onClick={runTrial}>Flip Once</button>
        <button onClick={runMany}>Flip 100x</button>
        <button onClick={reset} className="secondary">Reset</button>
      </div>
    </div>
  );
};

// Game Theory - Prisoner's Dilemma
const GameTheory = () => {
  const [yourChoice, setYourChoice] = useState(null);
  const [opponentChoice, setOpponentChoice] = useState(null);
  const [scores, setScores] = useState({ you: 0, opponent: 0 });
  const [rounds, setRounds] = useState(0);
  
  const strategies = ['cooperate', 'defect', 'tit-for-tat', 'random'];
  const [opponentStrategy, setOpponentStrategy] = useState('tit-for-tat');
  const [lastOpponentMove, setLastOpponentMove] = useState(null);
  
  const play = (choice) => {
    let oppMove;
    
    switch(opponentStrategy) {
      case 'cooperate':
        oppMove = 'cooperate';
        break;
      case 'defect':
        oppMove = 'defect';
        break;
      case 'tit-for-tat':
        oppMove = lastOpponentMove || 'cooperate';
        break;
      case 'random':
        oppMove = Math.random() > 0.5 ? 'cooperate' : 'defect';
        break;
      default:
        oppMove = 'cooperate';
    }
    
    setYourChoice(choice);
    setOpponentChoice(oppMove);
    setLastOpponentMove(choice);
    setRounds(r => r + 1);
    
    // Payoff matrix
    let yourPoints = 0;
    let oppPoints = 0;
    
    if (choice === 'cooperate' && oppMove === 'cooperate') {
      yourPoints = 3; oppPoints = 3;
    } else if (choice === 'cooperate' && oppMove === 'defect') {
      yourPoints = 0; oppPoints = 5;
    } else if (choice === 'defect' && oppMove === 'cooperate') {
      yourPoints = 5; oppPoints = 0;
    } else {
      yourPoints = 1; oppPoints = 1;
    }
    
    setScores(s => ({
      you: s.you + yourPoints,
      opponent: s.opponent + oppPoints
    }));
  };
  
  return (
    <div className="game-theory-section">
      <div className="section-label">03 — Game Theory</div>
      <h3>Prisoner's Dilemma</h3>
      <p className="subtitle">Cooperation vs. betrayal. What's your strategy?</p>
      
      <div className="game-stats">
        <div className="player-stat">
          <div className="player-label">You</div>
          <div className="player-score">{scores.you}</div>
          {yourChoice && <div className="last-move">{yourChoice}</div>}
        </div>
        <div className="vs">VS</div>
        <div className="player-stat">
          <div className="player-label">Opponent</div>
          <div className="player-score">{scores.opponent}</div>
          {opponentChoice && <div className="last-move">{opponentChoice}</div>}
        </div>
      </div>
      
      <div className="game-info">
        <div>Rounds played: {rounds}</div>
        <div>Opponent strategy: {opponentStrategy}</div>
      </div>
      
      <div className="controls">
        <button onClick={() => play('cooperate')} className="cooperate-btn">
          🤝 Cooperate
        </button>
        <button onClick={() => play('defect')} className="defect-btn">
          ⚔️ Defect
        </button>
      </div>
      
      <div className="strategy-selector">
        <label>Change opponent strategy:</label>
        <select 
          value={opponentStrategy} 
          onChange={(e) => {
            setOpponentStrategy(e.target.value);
            setScores({ you: 0, opponent: 0 });
            setRounds(0);
            setLastOpponentMove(null);
          }}
        >
          {strategies.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

// Topology Visualizer
const TopologyViz = () => {
  const [shape, setShape] = useState('torus');
  const [rotation, setRotation] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(r => (r + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);
  
  const getPath = () => {
    const rad = rotation * Math.PI / 180;
    switch(shape) {
      case 'torus':
        return `M 200 150 
                Q ${200 + Math.cos(rad) * 50} ${150 + Math.sin(rad) * 30} 200 150
                M 150 150 
                Q ${150 + Math.cos(rad + 1) * 60} ${150 + Math.sin(rad + 1) * 40} 250 150
                Q ${250 + Math.cos(rad + 2) * 60} ${150 + Math.sin(rad + 2) * 40} 150 150`;
      case 'mobius':
        return `M ${200 + Math.cos(rad) * 80} ${150 + Math.sin(rad) * 80}
                L ${200 + Math.cos(rad + Math.PI) * 80} ${150 + Math.sin(rad + Math.PI) * 80}
                Q 200 ${150 + Math.sin(rad + Math.PI/2) * 40} ${200 + Math.cos(rad) * 80} ${150 + Math.sin(rad) * 80}`;
      case 'klein':
        return `M ${200 + Math.cos(rad) * 70} ${150 + Math.sin(rad * 2) * 60}
                Q ${200 + Math.cos(rad + 1) * 80} ${150 + Math.sin(rad + 1) * 50}
                  ${200 + Math.cos(rad + 2) * 70} ${150 + Math.sin(rad * 2 + 2) * 60}`;
      default:
        return '';
    }
  };
  
  return (
    <div className="topology-section">
      <div className="section-label">04 — Topology</div>
      <h3>Non-Euclidean Surfaces</h3>
      <p className="subtitle">Shapes that twist, fold, and defy intuition</p>
      
      <svg className="topology-canvas" viewBox="0 0 400 300">
        <defs>
          <linearGradient id="topoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#667eea" />
            <stop offset="100%" stopColor="#764ba2" />
          </linearGradient>
        </defs>
        <path 
          d={getPath()} 
          stroke="url(#topoGrad)" 
          strokeWidth="3" 
          fill="none"
          strokeLinecap="round"
        />
      </svg>
      
      <div className="shape-selector">
        {['torus', 'mobius', 'klein'].map(s => (
          <button 
            key={s}
            className={shape === s ? 'active' : ''}
            onClick={() => setShape(s)}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
};

// Main App
function App() {
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <div className="App">
      <nav className={scrolled ? 'scrolled' : ''}>
        <div className="logo">TS</div>
        <div className="nav-links">
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>
      
      <section className="hero">
        <div className="hero-content">
          <div className="hero-left">
            <h1>
              <span className="name-line">Thabang</span>
              <span className="name-line">Serone</span>
            </h1>
            <p className="tagline">
              I turn data into insights, build interactive experiences, 
              and explore the mathematical structures that govern complexity.
            </p>
            <div className="hero-tags">
              <span>Data Analysis</span>
              <span>Web Development</span>
              <span>Mathematics</span>
              <span>AI Applications</span>
            </div>
          </div>
          <div className="hero-right">
  <div className="photo-container">
    <img src="/photo.jpg" alt="Thabang Serone" className="profile-photo" />
  </div>
</div>
        </div>
        
        <div className="scroll-indicator">
          <div className="scroll-line"></div>
          <span>Scroll to explore</span>
        </div>
      </section>
      
      <section className="manifesto" id="about">
        <div className="manifesto-content">
          <div className="section-label">00 — Philosophy</div>
          <h2>Mathematics, Data, and Building Things</h2>
          <div className="manifesto-grid">
            <div className="manifesto-item">
              <h4>Self-Taught & Curious</h4>
              <p>
                I believe the best learning happens when you're building something real. 
                Python, SQL, R, JavaScript—each language is a tool for asking better questions 
                and finding patterns in chaos.
              </p>
            </div>
            <div className="manifesto-item">
              <h4>Math as a Lens</h4>
              <p>
                From fractal geometry to game theory, mathematics reveals the hidden structures 
                in everything. I'm fascinated by probability, topology, and how complex systems 
                emerge from simple rules.
              </p>
            </div>
            <div className="manifesto-item">
              <h4>AI for Productivity</h4>
              <p>
                AI isn't about replacement—it's about augmentation. I explore how machine learning 
                and intelligent systems can amplify human creativity and decision-making.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="interactive-work" id="work">
        <div className="section-header">
          <h2>Skills in Action</h2>
          <p>This site is my first project. Each section demonstrates a different skill through interaction.</p>
        </div>
        
        <FractalExplorer />
        <ProbabilitySimulator />
        <GameTheory />
        <TopologyViz />
      </section>
      
      <section className="tech-stack">
        <div className="section-label">05 — Technical Skills</div>
        <h2>Tools & Technologies</h2>
        <div className="tech-grid">
          <div className="tech-category">
            <h4>Data Analysis</h4>
            <ul>
              <li>Python (Pandas, NumPy, Scikit-learn)</li>
              <li>R (Statistical Computing)</li>
              <li>SQL (Query Optimization)</li>
              <li>Data Visualization (Matplotlib, ggplot2)</li>
            </ul>
          </div>
          <div className="tech-category">
            <h4>Web Development</h4>
            <ul>
              <li>JavaScript (ES6+, React)</li>
              <li>HTML5 & CSS3</li>
              <li>Responsive Design</li>
              <li>Interactive Visualizations</li>
            </ul>
          </div>
          <div className="tech-category">
            <h4>Mathematical Interests</h4>
            <ul>
              <li>Probability Theory</li>
              <li>Topology</li>
              <li>Game Theory</li>
              <li>Fractal Geometry</li>
            </ul>
          </div>
          <div className="tech-category">
            <h4>AI & Productivity</h4>
            <ul>
              <li>Machine Learning Workflows</li>
              <li>Process Automation</li>
              <li>Intelligent Systems Design</li>
              <li>Data-Driven Decision Making</li>
            </ul>
          </div>
        </div>
      </section>
      
      <section className="cta" id="contact">
        <div className="cta-content">
          <h2>Let's Build Something</h2>
          <p>
            I'm currently building more projects and looking for opportunities to apply 
            data analysis and development skills. Interested in collaborating?
          </p>
          <div className="cta-buttons">
            <a href="mailto:your.email@example.com" className="btn-primary">
              Get in Touch
            </a>
            <a href="https://github.com/yourusername" className="btn-secondary" target="_blank" rel="noopener noreferrer">
              GitHub →
            </a>
          </div>
        </div>
      </section>
      
      <footer>
        <p>© 2024 Thabang Serone. Built with React & curiosity.</p>
        <p className="footer-note">This site is itself a demonstration of web development and mathematical visualization skills.</p>
      </footer>
    </div>
  );
}

export default App;
