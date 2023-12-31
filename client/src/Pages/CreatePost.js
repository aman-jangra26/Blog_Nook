import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import Editor from "../Editor";

export default function CreatePost() {
  const inputStyle = {
    width: "100%",
    padding: "8px",
    margin: "10px 0",
    borderRadius: "3px",
    border: "1px solid #ccc",
  };

  const buttonStyle = {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "5px",
    border: "none",
    backgroundColor: "#333333",
    color: "#fff",
    cursor: "pointer",
    transition: "background-color 0.3s",
  };

  const [isButtonHovered, setButtonHovered] = useState(false);

  const handleButtonHover = () => {
    setButtonHovered(true);
  };

  const handleButtonLeave = () => {
    setButtonHovered(false);
  };
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState("");
  const [redirect, setRedirect] = useState(false);

  async function createNewPost(ev) {
    ev.preventDefault();

    const data = new FormData();
    data.set("title", title);
    data.set("summary", summary);
    data.set("content", content);
    data.append("file", files[0]);

    const response = await fetch("http://localhost:4000/post", {
      method: "POST",
      body: data,
      credentials: "include",
    });

    if (response.ok) {
      setRedirect(true);
    }
  }

  if (redirect) {
    return <Navigate to={"/"} />;
  }

  return (
    <form onSubmit={createNewPost}>
      <input
        type="text"
        placeholder={"Title"}
        style={inputStyle}
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
      />
      <input
        type="text"
        placeholder={"Summary"}
        style={inputStyle}
        value={summary}
        onChange={(ev) => setSummary(ev.target.value)}
      />
      <input
        type="file"
        style={inputStyle}
        onChange={(ev) => setFiles(ev.target.files)}
      />
      <ReactQuill
        value={content}
        onChange={setContent}
        style={{ height: "400px", marginBottom: "20px" }}
      />
      <button
        style={{
          ...buttonStyle,
          backgroundColor: isButtonHovered ? "#007bff" : "#333333",
        }}
        onMouseEnter={handleButtonHover}
        onMouseLeave={handleButtonLeave}
      >
        Create post
      </button>
    </form>
  );
}
