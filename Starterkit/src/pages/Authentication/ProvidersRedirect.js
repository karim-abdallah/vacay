import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { post } from "../../helpers/api_helper";
import Logo from "../../assets/images/logo-vaccay.svg";

const ProvidersRedirect = () => {

    const [errorMessage, setErrorMessage] = useState();
    const [page, setPage] = useState()
    const params = useParams();
    const history = useHistory();


    function getHashValue(key) {
        var matches = window.location.hash.match(new RegExp(key + '=([^&]*)'));
        return matches ? matches[1] : null;
    }

    function fetchAccessToken() {
        let provider = params['provider']
        if (provider) {
            if (provider == 'google') {
                let access_token = getHashValue('access_token')
                let obj = { provider, access_token }
                verifyOauthUser(obj)
            } else {
                let code = new URLSearchParams(history.location.search).get('code');
                let obj = { provider, code }
                verifyOauthUser(obj)
            }
        }
    }

    async function verifyOauthUser(obj) {

        try {
            let response = await post('/auth/oauth-verify-token', obj)
            let data = response['data']

            localStorage.setItem("access_token", data['access_token']);
            localStorage.setItem("refresh_token", data['refresh_token']);

            if (data['is_existing']) {
                history.push('/dashboard');
            } else {
                history.push('/onboarding');
            }

        }
        catch (error) {
            setPage('Login')
            setErrorMessage(error['detail'])
            setTimeout(() => {
                history.push('/login');
            }, 3000);
        }
    }

    useEffect(() => {
        fetchAccessToken()
    }, []);


    return (
        <React.Fragment>
            <div className="d-flex justify-content-between flex-column min-vh-100">
                <div className="Login-form">
                    <div className="container-fluid m-0">
                        <div className="row">
                            <div className="col-lg-4 col-md-5 vh-100 align-items-center p-0 d-none d-md-block">
                                <div className="div">
                                    <div className="content-section mt-5 pt-5">
                                        <div className="d-flex gap-2 flex-wrap align-items-center">
                                            <img src={Logo} className="img-fluid" alt="vaccay-logo" />
                                        </div>
                                        <p>Optimize your time off</p>
                                    </div>
                                    <lottie-player
                                        className="side-img"
                                        src="https://vacay-assets.s3.amazonaws.com/lottie.json"
                                        background="transparent"
                                        speed="1"
                                        loop
                                        autoplay
                                    ></lottie-player>
                                </div>
                            </div>
                            <div className="col-lg-8  col-md-7 p-0">
                                <div className="form-card d-flex align-items-center px-0 px-lg-5">
                                    <div>
                                        <div className="container md:px-3 px-md-5">
                                            {errorMessage && (
                                                <div className="alert alert-danger">OOPS... sorry we encountered a problem logging in you. You will be redirected to Login Page in 3 seconds</div>
                                            )}
                                            <p>
                                                {page && (
                                                    <p> Redirecting you to {page} Page......</p>
                                                )}

                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );

}



export default ProvidersRedirect
