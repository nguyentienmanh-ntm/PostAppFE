import React, { useContext, useEffect } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as  Yup from 'yup'
import axios from "axios"
import { AuthContext } from "../helpers/AuthContext";
import { useNavigate } from 'react-router-dom'

const CreatePost = () => {
    const { authState } = useContext(AuthContext)
    let navigate = useNavigate()
    const initialValues = {
        title: "",
        postText: "",
    };

    useEffect(() => {
        if (!localStorage.getItem("accessToken")) {
            navigate('/login')
        } else {

        }
    }, [authState.status, navigate])

    const validationSchema = Yup.object().shape({
        title: Yup.string().required("You must input a Title!"),
        postText: Yup.string().required(),
    });


    const onSubmit = (data) => {
        axios
            .post("http://localhost:3001/posts", data, {
                headers: { accessToken: localStorage.getItem("accessToken") }
            })
            .then((res) => {
                navigate('/')
            });
    };

    return (
        <div className='createPostPage' >
            <Formik
                initialValues={initialValues}
                onSubmit={onSubmit}
                validationSchema={validationSchema}
            >
                <Form className='formContainer'>
                    <label>Title: </label>
                    <ErrorMessage name='title' component="span" />
                    <Field
                        autocomplete="off"
                        id="inputCreatePost"
                        name="title"
                        placeholder="(Ex.Title..."
                    />

                    <label>PostText: </label>
                    <ErrorMessage name='postText' component="span" />
                    <Field
                        autocomplete="off"
                        id="inputCreatePost"
                        name="postText"
                        placeholder="(Ex.PostText..."
                    />


                    <button type='submit'>Create Post</button>
                </Form>


            </Formik>
        </div >
    )
}


export default CreatePost
