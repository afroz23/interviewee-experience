import React, { useState, useEffect } from "react";
import { TextField, Button, Typography, Paper } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import FileBase from "react-file-base64";

import useStyles from "./styles";
import { createPost, updatePost } from "../../actions/posts";

const Form = ({ currentId, setCurrentId }) => {
  const [postData, setPostData] = useState({
    interviewee: "",
    position: "",
    message: "",
    tags: "",
    selectedFile: "",
  });
  const [error, setError] = useState("");
  const post = useSelector((state) =>
    currentId ? state.posts.find((message) => message._id === currentId) : null
  );
  const dispatch = useDispatch();
  const classes = useStyles();

  useEffect(() => {
    if (post) setPostData(post);
  }, [post]);

  const clear = () => {
    setCurrentId(0);
    setPostData({
      interviewee: "",
      position: "",
      message: "",
      tags: "",
      selectedFile: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      postData.interviewee === "" &&
      postData.position === "" &&
      postData.message === "" &&
      postData.tags === ""
    ) {
      setError("All fields are required");
    } else if (postData.interviewee === "") {
      setError("Interviewee field is required");
    } else if (postData.position === "") {
      setError("Position field is required");
    } else if (postData.message === "") {
      setError("message field is required");
    } else if (postData.tags === "") {
      setError("Enter atleast one tag");
    } else {
      if (currentId === 0) {
        dispatch(createPost(postData));
        clear();
      } else {
        dispatch(updatePost(currentId, postData));
        clear();
      }
      setError("");
    }
  };

  return (
    <Paper className={classes.paper}>
      <form
        autoComplete="off"
        noValidate
        className={`${classes.root} ${classes.form}`}
        onSubmit={handleSubmit}
      >
        <Typography variant="h6">
          {currentId ? `Editing "${post.position}"` : "Share a message"}
        </Typography>
        <TextField
          name="interviewee"
          variant="outlined"
          label="Interviewee"
          fullWidth
          value={postData.interviewee}
          onChange={(e) =>
            setPostData({ ...postData, interviewee: e.target.value })
          }
        />
        <TextField
          name="position"
          variant="outlined"
          label="Position"
          fullWidth
          value={postData.position}
          onChange={(e) =>
            setPostData({ ...postData, position: e.target.value })
          }
        />
        <TextField
          name="message"
          variant="outlined"
          label="Experience"
          fullWidth
          multiline
          rows={4}
          value={postData.message}
          onChange={(e) =>
            setPostData({ ...postData, message: e.target.value })
          }
        />
        <TextField
          name="tags"
          variant="outlined"
          label="Tags (coma separated)"
          fullWidth
          value={postData.tags}
          onChange={(e) =>
            setPostData({ ...postData, tags: e.target.value.split(",") })
          }
        />
        <div className={classes.fileInput}>
          <FileBase
            type="file"
            multiple={false}
            onDone={({ base64 }) =>
              setPostData({ ...postData, selectedFile: base64 })
            }
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}

        <Button
          className={classes.buttonSubmit}
          variant="contained"
          color="primary"
          size="large"
          type="submit"
          fullWidth
        >
          Submit
        </Button>
        <Button
          variant="contained"
          color="secondary"
          size="small"
          onClick={clear}
          fullWidth
        >
          Clear
        </Button>
      </form>
    </Paper>
  );
};

export default Form;
