import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "./Button";
import { useAppDispatch } from "../app/hooks";
import { useRegisterUserMutation, useLazySendEmailQuery } from "../services/userAuthService";
import { setCredentials } from "../features/authSlice";
import { storeToken } from "../services/LocalStorageService";
import { toast } from "react-toastify";
import { FloatingLabel } from "flowbite-react";

const Registration: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  interface UserData {
    _id: string;
    access: string;
    email: string;
    family_name: string;
    given_name: string;
  }

  const [formData, setFormData] = useState({
    given_name: "",
    family_name: "",
    email: "",
    password: "",
  });

  const [registerUser] = useRegisterUserMutation();
  const [sendEmail, { isSuccess: EmailSent }] = useLazySendEmailQuery();
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await registerUser(formData).unwrap();
      const userData: UserData = res as UserData;

      await sendEmail({ access_token: userData.access }).unwrap();
      storeToken({ value: { access: userData.access } });
      dispatch(setCredentials({ access: userData.access }));
      toast.success("Registered successfully");
      navigate("/");
    } catch (error) {
      toast.error("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (EmailSent) {
      toast.success("Verification email sent");
    }
  }, [EmailSent]);

  return (
    <div className="flex justify-center items-top">
      <div className="w-full max-w-2xl p-8 rounded-md shadow-md bg-main-secondary dark:bg-dark-secondary text-main-text dark:text-dark-text">
        <h2 className="mb-4 text-2xl font-bold">Registration</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <FloatingLabel variant="standard" label="Given Name" id="given_name" type="text" value={formData.given_name} onChange={handleChange} required />
          </div>
          <div className="mb-4">
            <FloatingLabel variant="standard" label="Family Name" id="family_name" type="text" value={formData.family_name} onChange={handleChange} required />
          </div>
          <div className="mb-4">
            <FloatingLabel variant="standard" label="Email" id="email" type="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="mb-4">
            <FloatingLabel variant="standard" label="Password" id="password" type="password" value={formData.password} onChange={handleChange} required />
          </div>
          <Button
            type="submit"
            className={`w-full p-2 rounded text-main-text dark:text-dark-text ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"} focus:outline-none`}
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Registration;
