import { nanoid } from "nanoid";
import { useState } from "react";
import NewComment from "./NewComment";
import Reply from "./Reply";
import deleteIcon from '../images/icon-delete.svg'
import editIcon from '../images/icon-edit.svg'
import minusIcon from '../images/icon-minus.svg'
import plusIcon from '../images/icon-plus.svg'
import replyIcon from '../images/icon-reply.svg'



export default function Comment(props) {
  const [score, setScore] = useState(props.score);
  const [disableUpvote, setDisableUpvote] = useState(false);
  const [disableDownvote, setDisableDownvote] = useState(false);
  const [backendReplies, setBackendReplies] = useState(props.replies);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  let starterScore = props.score;
  const isCurrentUser = true;
  const isReplying =
    props.activeComment &&
    props.activeComment.id === props.id &&
    props.activeComment.type === "replying";
  const isEditing =
    props.activeComment &&
    props.activeComment.id === props.id &&
    props.activeComment.type === "editing";


    var isAdmin = false;
    var admin = localStorage.getItem("userRole");
    console.log(admin);
    if(admin == "ADMIN")
    {
      isAdmin = true;
    }

  const handleScoreChange = (e) => {
    if (e.target.classList.contains("minus-btn")) {
      setScore((prevScore) => prevScore - 1);
      if (score - starterScore < 1) {
        setDisableDownvote(true);
        setDisableUpvote(false);
        starterScore = props.score;
      }
    }
    if (e.target.classList.contains("plus-btn")) {
      setScore((prevScore) => prevScore + 1);
      if (starterScore - score < 1) {
        setDisableUpvote(true);
        setDisableDownvote(false);
        starterScore = props.score;
      }
    }
  };

  const createReply = async (text) => {
    return {
      content: text,
      createdAt: "Just now",
      id: nanoid(),
      replyingTo: props.user.username,
      score: 1,
      user: props.currentUser,
    };
  };

  const addReply = (text) => {
    createReply(text).then((reply) => {

      setBackendReplies([reply, ...backendReplies]);
    });
    props.setActiveComment(null);
  };

  const deleteReply = (replyId) => {
    for (let i = 0; i < backendReplies.length; i++) {
      const updatedBackendReplies = backendReplies.filter(
        (backendReply) => backendReply.id !== replyId
      );
      setBackendReplies(updatedBackendReplies);
    }
  };

  const updateReply = (text, replyId) => {
    const updatedBackendReplies= backendReplies.map((backendReply) => {
      if (backendReply.id === replyId) {
        return {...backendReply, content: text}
      }
      return backendReply
    })
    setBackendReplies(updatedBackendReplies)
    props.setActiveComment(null)
  }
  console.log(props.tekst)
  return (
    <div className="comment-container">
      <div className="comment">
        <div className="comment-heading">
          <p className="username">{/*props.user.username*/}</p>
          {/*props.user.username === props.currentUser.username && (
            <p className="tag">you</p>

          )*/}
            {props.tekst}
  
        </div>
      
        <div className="editing">
          {!isEditing && <p className="comment-content">{props.tekst} </p>}
          {isEditing && (
            <NewComment
              currentUser={props.currentUser}
              
              handleSubmit={(text) => {
                props.updateComment(text, props.id);
              }}
              initialText={props.tekst}
              isEdit
              buttonText='update'
            />
          )}
        </div>
        
        <div className="comment-footer">
          {isCurrentUser ? (
            <div className="toggled-btns">
              { isAdmin &&
              <button
                className="delete-btn"
                onClick={() => {
                  setShowDeleteModal(true);
                }}
              >
                <img
                  className="delete-icon"
                  src={deleteIcon}
                  alt="delete icon"
                />
                Delete
              </button> }
              { isAdmin && 
              <button
                className="edit-btn"
                onClick={() => {
                  props.setActiveComment({ id: props.id, type: "editing" });
                }}
              >
                <img
                  className="edit-icon"
                  src={editIcon}
                  alt="edit icon"
                />
                Edit
              </button> }
            </div>
          ) : (
            <button
              className="reply-btn"
              onClick={() =>
                props.setActiveComment({ id: props.id, type: "replying" })
              }
            >
              <img
                className="reply-icon"
                src={replyIcon}
                alt="reply icon"
              />
              Reply
            </button>
          )}
        </div>
      </div>
      {isReplying && (
        <div>
          <NewComment
            currentUser={props.currentUser}
            placeholder={`Replying to @${props.user.username}`}
            handleSubmit={(text) =>
              addReply(`@${props.user.username}, ${text}`)
            }
            buttonText='reply'
          />
        </div>
      )}
      {props.replies && (
        <div className="replies-container">
          {backendReplies.map((reply) => (
            <div className="reply">
              <Reply
                key={reply.id}
                currentUser={props.currentUser}
                activeComment={props.activeComment}
                setActiveComment={props.setActiveComment}
                addReply={addReply}
                deleteReply={deleteReply}
                updateReply={updateReply}
                {...reply}
              />
            </div>
          ))}
        </div>
      )}
      {showDeleteModal && (
        <div className="delete-modal-container">
          <div className="delete-modal">
            <h2 className="delete-modal_title">Delete comment</h2>
            <p className="delete-modal_content">
              Are you sure you want to delete this comment? This will remove the
              comment and can't be undone.
            </p>
            <div className="delete-modal_btns">
              <button
                className="delete-modal_btn no"
                onClick={() => {
                  setShowDeleteModal(false);
                }}
              >
                No, cancel
              </button>
              <button
                className="delete-modal_btn yes"
                onClick={() => {
                  props.deleteComment(props.id);
                }}
              >
                Yes, delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
