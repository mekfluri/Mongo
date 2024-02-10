import { useState } from "react";
import MovieCard from "../../../components/MoviesTable/MovieCard";

export default function NewComment({
  movieId,
  handleSubmit,
  placeholder = "Add comment...",
  initialText = "",
  isEdit = false,
  buttonText
}) {
  const [text, setText] = useState(initialText);

  const onSubmit = async (e) => {
    e.preventDefault();
    
    console.log(movieId);
    console.log(text)
    var CurrentUserId = localStorage.getItem("currentUser")
    if(movieId == undefined)
    {
      handleSubmit(text);
      window.location.reload();
    }else
    {
      try {
        const response = await fetch(`http://localhost:5054/Komentar/DodajKomentar/${CurrentUserId}/${movieId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ tekst: text })
        });
        if (!response.ok) {
          throw new Error('Error adding comment');
        }
       
        setText("");
        
        handleSubmit(text);
      } catch (error) {
        console.error('Error adding comment:', error.message);
      }
    }
    
  };



  return (
    <form
      className={isEdit ? "edit-comment" : "new-comment-container"}
      onSubmit={onSubmit}
    >
      <textarea
        className="new-comment"
        placeholder={placeholder}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
        }}
      />
      <button className="submit" type="submit">
        {buttonText}
      </button>
    </form>
  );
}
