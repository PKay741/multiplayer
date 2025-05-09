// import Confetti from "react-confetti";
// import { useEffect, useState } from "react";

// function GameOverModal({ winner, onRestart }) {
//   const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });

//   useEffect(() => {
//     const handleResize = () => {
//       setDimensions({ width: window.innerWidth, height: window.innerHeight });
//     };
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   const getResultMessage = () => {
//     if (winner === null) return "It's a draw!";
//     if (winner === me) return "You win! 🎉";
//     return "You lose 😞";
//   };

//   return (
//     <div style={styles.overlay}>
//       {winner && <Confetti width={dimensions.width} height={dimensions.height} />}
//       <div style={styles.modal}>
//         <h2>{winner ? `${winner} wins! 🎉` : "It's a draw!"}</h2>
//         <button onClick={onRestart}>Play Again</button>
//       </div>
//     </div>
//   );
// }

// const styles = {
//   overlay: {
//     position: "fixed",
//     top: 0, left: 0, right: 0, bottom: 0,
//     backgroundColor: "rgba(0, 0, 0, 0.5)",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     zIndex: 999,
//   },
//   modal: {
//     background: "white",
//     padding: "40px",
//     borderRadius: "12px",
//     textAlign: "center",
//     boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
//   },
// };

// export default GameOverModal;


import Confetti from "react-confetti";
import { useEffect, useState } from "react";

function GameOverModal({ winner, me, onRestart }) {
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getResultMessage = () => {
    if (winner === null) return "It's a draw! 🤝";
    if (winner === me) return "You win! 🎉";
    return "You lose 😞";
  };

  return (
    <div style={styles.overlay}>
      {winner && <Confetti width={dimensions.width} height={dimensions.height} />}
      <div style={styles.modal}>
        <h2>{getResultMessage()}</h2> {/* <- this is what makes it used */}
        <button onClick={onRestart}>Play Again</button>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  modal: {
    background: "white",
    padding: "40px",
    borderRadius: "12px",
    textAlign: "center",
    boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
    color: "#333",           // ✅ Make sure text is visible
    fontSize: "24px",        // ✅ Large enough to notice
    fontWeight: "bold",      // ✅ Emphasize the message
    
  },
};

export default GameOverModal;
