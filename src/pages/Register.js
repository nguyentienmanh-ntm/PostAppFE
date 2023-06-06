import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik'
import React from 'react'
import * as  Yup from 'yup'


const Register = () => {
    const initialValues = {
        username: "",
        password: "",
        confirmpassword: ""
    };

    const onSubmit = (data) => {
        try {
            axios.post("http://localhost:3001/auth", data).then((res) => {
                const message = res.data.message
                alert(message)
                console.log(data)
            })
        } catch (error) {
            const message = error.response.data.message;
            // Hiển thị thông báo lỗi
            console.log(message);

        }

    }


    const validationSchema = Yup.object().shape({
        username: Yup.string().required("You must input a Username!"),
        password: Yup.string().required(),
        confirmpassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
            .required('Confirm Password is required'),
    });
    return (
        <div >
            <Formik
                initialValues={initialValues}
                onSubmit={onSubmit}
                validationSchema={validationSchema}
            >
                <Form className='formContainer'>
                    <label>Username: </label>
                    <ErrorMessage name='username' component="span" />
                    <Field
                        autocomplete="off"
                        id="inputCreatePost"
                        name="username"
                        placeholder="(Ex.username..."
                    />

                    <label>Password: </label>
                    <ErrorMessage name='password' component="span" />
                    <Field
                        type="password"
                        autocomplete="off"
                        id="inputCreatePost"
                        name="password"
                        placeholder="(Ex.password..."
                    />

                    <label>Confirmpassword: </label>
                    <ErrorMessage name='confirmpassword' component="span" />
                    <Field
                        type="password"
                        autocomplete="off"
                        id="inputCreatePost"
                        name="confirmpassword"
                        placeholder="(Ex.confirmpassword..."
                    />
                    <button type="submit">Register</button>
                </Form>


            </Formik>
        </div >
    )
}

export default Register