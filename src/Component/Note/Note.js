import React, { useState, useEffect, useRef } from "react";
import EditSharpIcon from "@mui/icons-material/EditSharp";
import DeleteIcon from "@mui/icons-material/Delete";
import ViewStreamIcon from '@mui/icons-material/ViewStream';
import RefreshIcon from '@mui/icons-material/Refresh';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuIcon from '@mui/icons-material/Menu';
import AppsIcon from '@mui/icons-material/Apps';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
// import keeep from '../Note/keeep.pmg'
import icon from '../Img/icon.png'
import "./style.css";

const Note = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [notes, setNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedNoteIndex, setSelectedNoteIndex] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingContent, setEditingContent] = useState("");

  const formRef = useRef(null);

  useEffect(() => {
    const storedNotes = localStorage.getItem("noteItem");
    const parsedNotes = storedNotes ? JSON.parse(storedNotes) : [];

    const validNotes = parsedNotes.filter(
      (note) => note && note.title !== null && note.content !== null
    );

    setNotes(validNotes);
  }, []);

  const handleTitle = (e) => {
    if (isEditing) {
      setEditingTitle(e.target.value);
    } else {
      setTitle(e.target.value);
    }
  };

  const handleContent = (e) => {
    if (isEditing) {
      setEditingContent(e.target.value);
    } else {
      setContent(e.target.value);
    }
  };

  const addNote = () => {
    const newNote = { title, content };

    if (title.trim() === "" || content.trim() === "") {
      return alert("Title and content cannot be empty");
    }

    if (isEditing) {
      const updatedNotes = [...notes];
      updatedNotes[selectedNoteIndex] = {
        title: editingTitle,
        content: editingContent,
      };
      setNotes(updatedNotes);
      localStorage.setItem("noteItem", JSON.stringify(updatedNotes));
      setTitle("");
      setContent("");
      setIsFormVisible(false);
      setIsEditing(false);
      setEditingTitle("");
      setEditingContent("");
    } else {
      setNotes((prevNotes) => {
        const newNotes = [...prevNotes, newNote];
        localStorage.setItem("noteItem", JSON.stringify(newNotes));
        return newNotes;
      });

      setTitle("");
      setContent("");
      setIsFormVisible(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleClickOutside = (event) => {
    if (formRef.current && !formRef.current.contains(event.target)) {
      setIsFormVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleEdit = (index) => {
    const selectedNote = notes[index];

    if (selectedNote) {
      setEditingTitle(selectedNote.title);
      setEditingContent(selectedNote.content);

      setIsFormVisible(true);
      setSelectedNoteIndex(index);
      setIsEditing(true);
    } else {
      console.error("Selected note is null or undefined");
    }
  };

  const handleSaveEdit = () => {
    const updatedNotes = [...notes];
    updatedNotes[selectedNoteIndex] = {
      title: editingTitle,
      content: editingContent,
    };
    setNotes(updatedNotes);
    localStorage.setItem("noteItem", JSON.stringify(updatedNotes));

    setEditingTitle("");
    setEditingContent("");

    setTitle("");
    setContent("");
    setIsFormVisible(false);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setTitle("");
    setContent("");
    setIsFormVisible(false);
    setIsEditing(false);
  };

  const handleDelete = (index) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (confirmDelete) {
      const updatedNotes = [...notes];
      updatedNotes.splice(index, 1);
      setNotes(updatedNotes);
      localStorage.setItem("noteItem", JSON.stringify(updatedNotes));
    }
  };

  return (
    <div className="main-cont">
      <div className="nav">
      <MenuIcon/>
      <img src={icon} style={{height:'30px'}}/>
        <span>Keep</span>

        <input
          type="search"
          placeholder="Search notes based on titles or content"
          value={searchTerm}
          onChange={handleSearch}
        />
        <RefreshIcon/>
        <ViewStreamIcon/>
        <SettingsIcon/>
        <AppsIcon/>
        <AccountCircleIcon/>
      </div>
      <div
        className="note-form"
        onClick={() => setIsFormVisible(true)}
        ref={formRef}
      >
        {!isFormVisible ? (
          <div className="placeholder-box">
            <p style={{ color: "black" }}>Write a note...</p>
          </div>
        ) : (
          <>
            <input
              type="text"
              placeholder="Title"
              name="title"
              required
              value={title}
              onChange={handleTitle}
            />
            <textarea
              type="text"
              placeholder="Content..."
              name="content"
              value={content}
              required
              onChange={handleContent}
            ></textarea>
            <button onClick={addNote}>Add Note</button>
          </>
        )}
      </div>
      <div className="box-cont">
        <div className="boxes">
          {filteredNotes.map((note, index) => (
            <div key={index} className="box" id="box-inpt">
              {isEditing && selectedNoteIndex === index ? (
                <>
                  <input
                    type="text"
                    placeholder="Title"
                    name="title"
                    required
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                  />
                  <textarea
                    type="text"
                    placeholder="Content..."
                    name="content"
                    value={editingContent}
                    required
                    onChange={(e) => setEditingContent(e.target.value)}
                  ></textarea>
                  <button onClick={handleSaveEdit}>Save</button>
                  <button onClick={handleCancelEdit}>Cancel</button>
                </>
              ) : (
                <>
                  <h3>{note?.title}</h3>
                  <p>{note?.content}</p>
                  <spna>
                    <EditSharpIcon
                      onClick={() => handleEdit(index)}
                      style={{ cursor: "pointer" }}
                    />
                  </spna>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <spna>
                    <DeleteIcon
                      onClick={() => handleDelete(index)}
                      style={{ cursor: "pointer" }}
                    />
                  </spna>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Note;
