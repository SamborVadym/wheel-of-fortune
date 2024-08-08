import React, { useRef, useState, useEffect, } from 'react';
import ShareButtons from "./ShareButtons";
import './App.css';

const spinDuration = 5000;

function App() {
  const [wheelSections, setWheelSections] = useState([{ id: 1, name: "test"}, {id: 2, name: "test 2"},{id: 3, name: "test 3"}]);
  const [newSection, setNewSection] = useState('');
  const [selectedPrize, setSelectedPrize] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const canvasRef = useRef(null);
  const currentAngleRef = useRef(0);
  const spinningRef = useRef(false);

  const startSpin = () => {
    if (spinningRef.current) return;

    setSpinning(true);
    spinningRef.current = true;

    const startTime = Date.now();
    const numSegments = wheelSections.length;
    const segmentAngle = (2 * Math.PI) / numSegments;
    const winningIndex = Math.floor(Math.random() * numSegments);

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / spinDuration, 1);

      const easing = 1 - progress;
      const rotationSpeed = easing * 0.1;

      currentAngleRef.current += rotationSpeed;
      drawWheel();

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        const finalAngle = (currentAngleRef.current % (2 * Math.PI));
        const adjustedAngle = (2 * Math.PI) - finalAngle;
        const winningSegmentIndex = Math.floor(adjustedAngle / segmentAngle) % numSegments;
        setSelectedPrize(wheelSections[winningSegmentIndex]);
        setSpinning(false);
        spinningRef.current = false;
      }
    };

    animate();
  };

  const addWheelSection = () => {
    if (newSection.trim() !== '') {
      setWheelSections([...wheelSections, { id: Math.random(), name: newSection }]);
      setNewSection('');
    }
  };

  const removeWheelSection = (id) => {
    const updatedPrizes = wheelSections.filter(section => section.id !== id);
    setWheelSections(updatedPrizes);
  };

  const drawWheel = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const numSegments = wheelSections.length;
    const segmentAngle = (2 * Math.PI) / numSegments;
    const wheelRadius = Math.min(canvas.width, canvas.height) / 2;
    const textRadius = wheelRadius * 0.7;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    wheelSections.forEach((section, i) => {
      const startSegmentAngle = i * segmentAngle + currentAngleRef.current;
      const endSegmentAngle = (i + 1) * segmentAngle + currentAngleRef.current;

      ctx.beginPath();
      ctx.moveTo(wheelRadius, wheelRadius);
      ctx.arc(wheelRadius, wheelRadius, wheelRadius, startSegmentAngle, endSegmentAngle);
      ctx.closePath();
      ctx.fillStyle = `hsl(${(360 / numSegments) * i}, 70%, 50%)`;
      ctx.fill();
      ctx.stroke();

      ctx.save();
      ctx.translate(wheelRadius, wheelRadius);
      ctx.rotate(startSegmentAngle + segmentAngle / 2);
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = 'white';
      ctx.font = '16px Arial';
      ctx.fillText(section.name, textRadius, 0);
      ctx.restore();
    });

    drawArrow(ctx, wheelRadius);
  };

  const drawArrow = (ctx, wheelRadius) => {
    const arrowWidth = 20;
    const arrowHeight = 40;
    const centerX = wheelRadius * 2; // Центр стрілки справа по центру колеса
    const centerY = wheelRadius;

    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - arrowWidth / 2);
    ctx.lineTo(centerX, centerY + arrowWidth / 2);
    ctx.lineTo(centerX - arrowHeight, centerY);
    ctx.closePath();
    ctx.fill();
  };

  useEffect(() => {
    if (wheelSections?.length) {
      drawWheel();
    }
  }, [wheelSections?.length]);

  return (
    <div className="App">
      <h1>Wheel of Fortune</h1>
      <div className="add">
        <input
          type="text"
          value={newSection}
          onChange={(e) => setNewSection(e.target.value)}
          placeholder="Add new value"
        />
        <button disabled={!newSection?.length} onClick={addWheelSection}>Add wheel section</button>
      </div>
      {wheelSections.length ? (
        <>
          <p>Win {selectedPrize && !spinning && `: ${selectedPrize.name}!`}</p>
          <canvas
            ref={canvasRef}
            width="400"
            height="400"
          />
          <div>
            <button onClick={startSpin} disabled={spinning}>
              Spin the Wheel!
            </button>
          </div>
        </>
      ) : null}
      {selectedPrize && !spinning && <ShareButtons title={selectedPrize.name} />}
      <div className="list">
        <h2>List</h2>
        {wheelSections.map((section) => (
          <div key={section.id} className="item">
            {section.name}
            <button className="remove-button" onClick={() => removeWheelSection(section.id)}>x</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
