import './App.css';
import React, { useState, useEffect } from 'react';

// Initialize the generative model
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI("%YOUR-API-KEY-HERE%");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Construct the prompt
const prompt_start = "Reply to the following message as if you were a medieval knight character:";
const prompt_end = "Keep the respnse under 200 characters and in one line without breaks. Append at the end a line break and the word that best describes your emotions out of: 'Sad', 'Happy', 'Shocked','Relaxed','Angry'.";


function App() {

  // Handle character message
  const [characterMessage, setCharacterMessage] = useState([]);

  // Handle API call
  async function aiRun() {
    const result = await model.generateContent([prompt_start, userMessage, prompt_end].join(" "));
    const response = result.response;
    console.log(response.text())
    const text = response.text().split("\n").filter((sentence) => sentence != "");
    setCharacterMessage(text[0]);
    setSprite(text[1]);
    setUserMessage("");
  }

  const handleClick = () => {
    aiRun();
  }

  // Handle initial message
  useEffect(() => {
    aiRun();
  }, []);

  // Handle display graphic
  const [sprite, setSprite] = useState("Relaxed");

  // Handle user message

  const [userMessage, setUserMessage] = useState("Hi!");
  const handleChangeUserMessage = (e) => {
    setUserMessage(e.target.value);
  }


  return (
    <div className="App">

      <img
        className="Background-image"
        src="/images/backgrounds/Castle_Background.png"
        alt="castle_background" />

      <p className="Version-info">ANIMATED CHATBOT PROJECT v1.0</p>

      <img
        className="Character-sprite"
        src={"/images/knight_character_sprites/Knight_" + sprite + ".png"}
        alt={"knight_sprite_" + sprite} />

      <div
        className="Messages-area">

        <div
          className="Character-textbox">

          <div
            className="Character-name">
            <p>Knight Guy</p>
            <img
              src="/images/ui_elements/Ribbon.png"
              alt="knight_name_background" />
          </div>

          <div
            className="Character-message">

            <p>{characterMessage}</p>
          </div>


        </div>

        <div
          className="User-textbox">

          <input
            placeholder='Type your message here'
            value={userMessage}
            onChange={(e) => handleChangeUserMessage(e)} />

          <button
            onClick={() => handleClick()}>
            Send
          </button>

        </div>

      </div>


    </div>
  );
}

export default App;
