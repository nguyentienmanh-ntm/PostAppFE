import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AuthContext } from "../helpers/AuthContext";


const Post = () => {
    let { id } = useParams()
    const [postObject, setPostObject] = useState({})
    const [comments, setComments] = useState([])
    const [newComment, setNewComment] = useState("")
    const { authState } = useContext(AuthContext);
    let navigate = useNavigate()

    useEffect(() => {
        axios.get(`http://localhost:3001/posts/byId/${id}`).then((res) => {
            setPostObject(res.data)
        })

        axios.get(`http://localhost:3001/comments/${id}`).then((res) => {
            setComments(res.data)
        }, [])


    })

    const addComment = () => {
        axios
            .post("http://localhost:3001/comments", {
                commentBody: newComment,
                PostId: id
            },
                {
                    headers: {
                        accessToken: localStorage.getItem("accessToken"),
                    }
                }
            )
            .then((res) => {
                if (res.data.error) {
                    alert(res.data.error)
                } else {
                    const commentToAdd = {
                        commentBody: newComment,
                        username: res.data.username,
                    };
                    setComments([...comments, commentToAdd]);
                    setNewComment("");
                }

            })
    }

    const deleteComment = (id) => {
        axios
            .delete(`http://localhost:3001/comments/${id}`, {
                headers: { accessToken: localStorage.getItem("accessToken") },
            })
            .then(() => {
                setComments(
                    comments.filter((val) => {
                        return val.id != id;
                    })
                );
            });
    };

    const deletePost = (id) => {
        axios
            .delete(`http://localhost:3001/posts/${id}`, {
                headers: { accessToken: localStorage.getItem("accessToken") },
            })
            .then(() => {
                navigate('/')
            })
    }

    const editPost = (option) => {
        if (option === "title") {
            let newTitle = prompt("Enter new Title!!")
            axios.put("http://localhost:3001/posts/title",
                {
                    newTitle: newTitle,
                    id: id
                },
                {
                    headers: { accessToken: localStorage.getItem("accessToken") },
                })
        } else {
            let newPostText = prompt("Enter new PostText!!")
            axios.put("http://localhost:3001/posts/postText",
                {
                    newPostText: newPostText,
                    id: id
                },
                {
                    headers: { accessToken: localStorage.getItem("accessToken") },
                })
        }
    }



    return (
        <div className='postPage'>
            <div className='leftSide'>
                <div className='post' id="individual">
                    <div className='title' onClick={() => {
                        if (authState.username === postObject.username) {
                            editPost("title")
                        }
                    }}>{postObject.title}</div>
                    <div className='body' onClick={() => {
                        if (authState.username === postObject.username) {
                            editPost("body")
                        }
                    }}>{postObject.postText}</div>
                    <div className='footer'>
                        {postObject.username}{" "}
                        {authState.username === postObject.username && (
                            <button
                                onClick={() => {
                                    deletePost(postObject.id);
                                }}
                            >
                                {" "}
                                Delete Post
                            </button>
                        )}
                    </div>
                </div>
            </div>
            <div className="rightSide">
                <div className="addCommentContainer">
                    <input
                        type="text"
                        placeholder="Comment..."
                        autoComplete="off"
                        value={newComment}
                        onChange={(event) => {
                            setNewComment(event.target.value);
                        }}
                    />
                    <button onClick={addComment}> Add Comment</button>
                </div>
                <div className="listOfComments">
                    {comments.map((comment, key) => {
                        return (
                            <div key={key} className="comment">
                                <label> username: {comment.username}</label>
                                {authState.username === comment.username && (
                                    <button
                                        onClick={() => {
                                            deleteComment(comment.id);
                                        }}
                                    >
                                        X
                                    </button>
                                )}
                                <div>
                                    {comment.commentBody}
                                </div>

                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    )
}

export default Post
