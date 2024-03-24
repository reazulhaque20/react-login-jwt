import { useContext, useEffect, useRef, useState } from "react";
import AuthContext from './context/AuthProvider';
import axios from "./api/axios";

const LOGIN_URL = '/auth/authenticate';

export default function Login(){

    const {setAuth} = useContext(AuthContext);

    const userRef = useRef();
    const errRef = useRef();

    const[user, setUser] = useState('');
    const[password, setPassword] = useState('');
    const[errMsg, setErrMsg] = useState('');
    const[success, setSuccess] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, []);

    useEffect(() => {
        setErrMsg('');
    },[user, password]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const response = await axios.post(
                LOGIN_URL,
                JSON.stringify({user, password}),
                {
                    headers: {'Content-Type': 'application/json'},
                    withCredentials: true
                }
            );

            console.log(JSON.stringify(response.data));
            const accessToken = response.data.accessToken;
            const roles = response.data.roles;
            setAuth(user, password, roles, accessToken);

            setUser('');
            setPassword('');
            setSuccess(true);
        }catch(error){
            if(!error.response){
                setErrMsg('No Server Response');
            }else if(error.response.status === 400){
                setErrMsg('Missing User name or Password');
            }else if(error.response.status === 401){
                setErrMsg('Unauthorized');
            }else{
                setErrMsg('Login Failed');
            }
            errRef.current.focus();
        }
        
    } 

    return(
        <>
        {success ? (
            <section>
                <h1>You are Logedin</h1>
                <br />
                <p>
                    <a href="#"> Go to Home</a>
                </p>
            </section>
        ) : (
        <section>
            <p ref={errRef} className={errMsg ? "errMsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">UserName:</label>
                <input type="text" id="username" 
                    ref={userRef}
                    autoComplete="off"
                    onChange={(e) => setUser(e.target.value)}
                    value={user}
                    required
                />
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" 
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    required
                />
                <button>Login</button>
            </form>
        </section>
        )}
        </>
    );
}