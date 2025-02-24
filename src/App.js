import './App.css';
import React, { useState, useCallback } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the generative model
const genAI = new GoogleGenerativeAI("AIzaSyD0B-CjCwj_m65Ow22AIEX2GQgsXTFK_Ec");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Construct the prompt
const prompt_start = "Reply to the following message as if you were a medieval knight character:";
const prompt_end = "Keep the response under 200 characters and in one line without breaks. Append at the end a line break and the word that best describes your emotions out of: 'Sad', 'Happy', 'Shocked','Relaxed','Angry'.";

function App() {
  // ✅ Declare state variables first
  const [characterMessage, setCharacterMessage] = useState("");
  const [sprite, setSprite] = useState("Relaxed");
  const [userMessage, setUserMessage] = useState("Hi!");

  // ✅ Define aiRun without unnecessary dependencies
  const aiRun = useCallback(async () => {
    try {
      const result = await model.generateContent([prompt_start, userMessage, prompt_end].join(" "));
      const response = result.response.text();
      console.log(response);
      
      const text = response.split("\n").filter(sentence => sentence !== "");
      
      if (text.length >= 2) {
        setCharacterMessage(text[0]); // First line is the message
        setSprite(text[1]); // Second line is the emotion
      } else {
        setCharacterMessage("No valid response.");
        setSprite("Unknown");
      }

      setUserMessage(""); // ✅ Clear user input after API call
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setCharacterMessage("Error generating response.");
      setSprite("Error");
    }
  }, [userMessage]); // ✅ Keeps dependency minimal

  // ✅ Removed useEffect to prevent unwanted calls
  // ❌ useEffect(() => { aiRun(); }, [aiRun]); // Removed this line

  // Handle user message input
  const handleChangeUserMessage = (e) => {
    setUserMessage(e.target.value);
  };

  return (
    <div className="App">
      <img className="Background-image" src="/images/backgrounds/Castle_Background.png" alt="castle_background" />
      <p className="Version-info">ANIMATED CHATBOT PROJECT v1.0</p>

      <img className="Character-sprite" src={`/images/knight_character_sprites/Knight_${sprite}.png`} alt={`knight_sprite_${sprite}`} />

      <div className="Messages-area">
        <div className="Character-textbox">
          <div className="Character-name">
            <p>Knight Guy</p>
            <img src="/images/ui_elements/Ribbon.png" alt="knight_name_background" />
          </div>
          <div className="Character-message">
            <p>{characterMessage}</p>
          </div>
        </div>

        <div className="User-textbox">
          <input
            placeholder='Type your message here'
            value={userMessage}
            onChange={handleChangeUserMessage}
          />
          <button onClick={aiRun}>Send</button> {/* ✅ Now only triggers on button click */}
        </div>
      </div>
    </div>
  );
}

export default App;
