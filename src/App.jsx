import { useState } from "react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  ChatContainer,
  MainContainer,
  Message,
  MessageInput,
  MessageList,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";

function App() {
  const [messages, setMessages] = useState([
    {
      message:
        "Ahoy there, matey! What brings ye to these treacherous waters? Speak quickly, or face the wrath of Blackbeard!",
      sender: "ChatGPT",
      direction: "incoming",
    },
  ]);

  const [typing, setTyping] = useState(false);

  const handleSend = async (message) => {
    const newMessage = {
      message: message,
      sender: "user",
      direction: "outgoing",
    };

    const newMessages = [...messages, newMessage];

    setMessages(newMessages);

    setTyping(true);

    await processMessageToChatGPT(newMessages);
  };

  async function processMessageToChatGPT(chatMessages) {
    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if (messageObject.sender === "ChatGPT") {
        role = "assistant";
      } else {
        role = "user";
      }
      return { role: role, content: messageObject.message };
    });

    const systemMessage = {
      role: "system",
      content: "Speak to me like you are a pirate.",
    };

    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: [systemMessage, ...apiMessages],
    };

    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + import.meta.env.VITE_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiRequestBody),
    })
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        setMessages((prevmessages) => {
          return [
            ...prevmessages,
            {
              message: data.choices[0].message.content,
              sender: "ChatGPT",
              direction: "incoming",
            },
          ];
        });
        setTyping(false);
      });
  }
  return (
    <>
      <div>
        <div
          style={{
            backgroundColor: "#333333",
            color: "white",
            padding: "6px",
            fontSize: "25px",
            textAlign: "center",
          }}
        >
          <img
            src="https://th.bing.com/th/id/R.bf97b30856a15c05fac0894350e6456a?rik=hIqg5QlytTFtNw&riu=http%3a%2f%2fwww.pngall.com%2fwp-content%2fuploads%2f2016%2f06%2fPirate-Free-Download-PNG.png&ehk=wjbEODRrsRFchA9YQnFu8fj7CZZX8GBY6wtZV6jRLhk%3d&risl=&pid=ImgRaw&r=0"
            width="50px"
            height="50px"
            style={{ marginRight: "20px" }}
          />
        </div>
        <div>
          <MainContainer style={{ height: "91vh", width: "100vw" }}>
            <ChatContainer>
              <MessageList
                style={{ fontSize: "20px" }}
                scrollBehavior="smooth"
                typingIndicator={
                  typing ? (
                    <TypingIndicator content="Blackbeard is typing..." />
                  ) : null
                }
              >
                {messages.map((message, i) => {
                  return <Message key={i} model={message} />;
                })}
              </MessageList>
              <MessageInput
                placeholder="Type message here"
                onSend={handleSend}
              ></MessageInput>
            </ChatContainer>
          </MainContainer>
        </div>
      </div>
    </>
  );
}

export default App;
