import React, { useState } from 'react';
import './Login.css';
import { detacontext } from '../../../../App';
import { ToastContainer, toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
  const [phone, setphone] = useState('');
  const [password, setpassword] = useState('');
  return (
    <detacontext.Consumer>
      {({ employeelogin }) => {
        return (
          <div className="login-container">
            <ToastContainer />
            <div className="container-fluid">
              <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4">
                  <div className="card">
                    <div className="card-body">
                      <form
                        className="login-dash"
                        onSubmit={(e) => employeelogin(e, phone, password)}
                      >
                        <div className="form-group">
                          <i className="login__icon fas fa-user"></i>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Your Phone"
                            onChange={(e) => setphone(e.target.value)}
                          />
                        </div>
                        <div className="form-group">
                          <i className="login__icon fas fa-lock"></i>
                          <input
                            type="password"
                            className="form-control"
                            placeholder="Password"
                            onChange={(e) => setpassword(e.target.value)}
                          />
                        </div>
                        <button className="btn btn-primary btn-block">
                          <span className="button__text">تسجيل الدخول</span>
                          <i className="button__icon fas fa-chevron-left"></i>
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }}
    </detacontext.Consumer>
  );
};

export default Login;
