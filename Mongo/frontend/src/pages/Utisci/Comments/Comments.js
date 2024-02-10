import React, { useState, useEffect } from "react";
import Axios from "axios";
import Comment from "./Comment";
import NewComment from "./NewComment";
import { nanoid } from "nanoid";

function Comments({ movieId }) {
  const [backendComments, setBackendComments] = useState([]);
  const [activeComment, setActiveComment] = useState(null);
  
  console.log(movieId)

  useEffect(() => {
    loadKomentari();
  }, []); // Empty dependency array ensures this effect runs only once when the component mounts

  const loadKomentari = () => {
    Axios.get("http://localhost:5054/Komentar/KomentariZaFilm/" + movieId)
      .then((resp) => {
        setBackendComments(resp.data);
      })
      .catch((error) => {
        console.error("Error loading comments:", error);
      });
  };

  const createComment = async (text) => {
    return {
      content: text,
      createdAt: "Just now",
      id: nanoid(),
      replies: [],
      score: 1,
      user: movieId,
    };
  };

  const addComment = (text) => {
    createComment(text).then((comment) => {
      setBackendComments([...backendComments, comment]);
    });
  };

  const deleteComment = async (commentId) => {
    const updatedBackendComments = backendComments.filter(
      (backendComment) => backendComment.id !== commentId
    );
    setBackendComments(updatedBackendComments);
  
    try {
      const response = await fetch(`http://localhost:5054/Komentar/ObrisiKomentar/${commentId}`, {
        method: 'DELETE', // Assuming you want to send a DELETE request
        headers: {
          'Content-Type': 'application/json'
     
        }
     
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
  
    } catch (error) {
      console.error('Error deleting comment:', error);

    }
  };
  

const updateComment = async (text, commentId) => {
  console.log("sad sam tu")
  try {
    const response = await fetch(`http://localhost:5054/Komentar/AzurirajKomentar/${commentId}`, {
      method: 'PUT', 
      headers: {
        'Content-Type': 'application/json'
       
      },
      body: JSON.stringify({ tekst: text }) 
    });

    if (!response.ok) {
      throw new Error('Failed to update comment');
    }
  console.log(response)
   
    const updatedBackendComments = backendComments.map((backendComment) => {
      if (backendComment.id === commentId) {
        return { ...backendComment, content: text };
      }
      return backendComment;
    });
    setBackendComments(updatedBackendComments);
    setActiveComment(null);


  } catch (error) {
    console.error('Error updating comment:', error);
    // Handle error
  }
};


  return (
    <main>
      {backendComments.map((comment) => (
        <Comment
          key={comment.id}
          movieId={movieId}
          replies={comment.replies}
          activeComment={activeComment}
          setActiveComment={setActiveComment}
          deleteComment={deleteComment}
          addComment={addComment}
          updateComment={updateComment}
          {...comment}
        />
      ))}
      <NewComment
        movieId={movieId}
        handleSubmit={addComment}
        initialText=""
        buttonText="send"
      />
    </main>
  );
}

export default Comments;
