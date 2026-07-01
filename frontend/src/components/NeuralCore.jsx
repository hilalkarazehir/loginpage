import "./NeuralCore.css";

export default function NeuralCore() {
  return (
    <div className="neural-core">

      <div className="ring ring1"></div>
      <div className="ring ring2"></div>
      <div className="ring ring3"></div>

    <svg className="connections" viewBox="0 0 300 300">
      <line x1="150" y1="35" x2="225" y2="75" />
      <line x1="225" y1="75" x2="265" y2="150" />
      <line x1="265" y1="150" x2="225" y2="225" />
      <line x1="225" y1="225" x2="150" y2="265" />
      <line x1="150" y1="265" x2="75" y2="225" />
      <line x1="75" y1="225" x2="35" y2="150" />
      <line x1="35" y1="150" x2="75" y2="75" />
      <line x1="75" y1="75" x2="150" y2="35" />

      <line x1="75" y1="75" x2="225" y2="75" />
      <line x1="225" y1="75" x2="225" y2="225" />
      <line x1="225" y1="225" x2="75" y2="225" />
      <line x1="75" y1="225" x2="75" y2="75" />

      <line x1="150" y1="35" x2="150" y2="150" />
      <line x1="265" y1="150" x2="150" y2="150" />
      <line x1="150" y1="265" x2="150" y2="150" />
      <line x1="35" y1="150" x2="150" y2="150" />

      <line x1="75" y1="75" x2="150" y2="150" />
      <line x1="225" y1="75" x2="150" y2="150" />
      <line x1="225" y1="225" x2="150" y2="150" />
      <line x1="75" y1="225" x2="150" y2="150" />
    </svg>

      <div className="node n1"></div>
      <div className="node n2"></div>
      <div className="node n3"></div>
      <div className="node n4"></div>
      <div className="node n5"></div>
      <div className="node n6"></div>
      <div className="node n7"></div>
      <div className="node n8"></div>

      <div className="core"></div>

    </div>
  );
}