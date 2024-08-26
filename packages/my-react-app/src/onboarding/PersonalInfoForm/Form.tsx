import React, { FormEvent, useEffect, useState } from "react";
import formStyles from "./form.module.css";
import btnStyles from "./button.module.css";
import { PersonalInfoFormValues } from "./types.ts";
import { useLocation } from "react-router-dom";

interface Props {
  onSuccessfulSubmit: (values: PersonalInfoFormValues) => void;
}

export const Form: React.FC<Props> = ({ onSuccessfulSubmit }: Props) => {
  const location = useLocation();
  const [values, setValues] = useState<PersonalInfoFormValues>({
    name: "",
    email: location.state?.email || "",
    phone: "",
  });
  const [errors, setErrors] = useState<PersonalInfoFormValues>({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    const storedValues = localStorage.getItem("personalInfoFormValues");
    if (storedValues) {
      setValues(JSON.parse(storedValues));
    }
  }, []);

  const validate = () => {
    let tempErrors = { name: "", email: "", phone: "" };
    if (!values.name) tempErrors.name = "Name is required";
    if (!values.email) tempErrors.email = "Email is required";
    if (!values.phone) tempErrors.phone = "Phone is required";
    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === "");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const numericValue = value.replace(/\D/g, "");
      setValues({ ...values, [name]: numericValue });
    } else {
      setValues({ ...values, [name]: value });
    }
    localStorage.setItem("personalInfoFormValues", JSON.stringify(values));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validate()) {
      onSuccessfulSubmit(values);
    }
  };

  return (
    <>
      <div className={formStyles.container}>
        <div className={formStyles.header}>
          <h1>Personal Info</h1>
          <p>Please provide your name, email address, and phone number</p>
        </div>
        <form onSubmit={handleSubmit} className={`info-form ${formStyles}`}>
          <div className={formStyles.formInputs}>
            <div className={formStyles.name}>
              <label>Name</label>
              <input
                type="text"
                name="name"
                placeholder="e.g. Stephan The Great"
                value={values.name}
                onChange={handleChange}
              />
              {errors.name && (
                <span className={formStyles.error}>{errors.name}</span>
              )}
            </div>
            <div className={formStyles.mail}>
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="e.g. ihateottomans@thegreat.com"
                value={values.email}
                onChange={handleChange}
                disabled
              />
              {errors.email && (
                <span className={formStyles.error}>{errors.email}</span>
              )}
            </div>
            <div className={formStyles.phone}>
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                placeholder="e.g. +40720305252"
                value={values.phone}
                onChange={handleChange}
                className={errors.phone ? formStyles.error : ""}
              />
              {errors.phone && (
                <span className={formStyles.error}>{errors.phone}</span>
              )}
            </div>
          </div>

          <div className={btnStyles.buttonCnt}>
            <button className={btnStyles.button} type="submit">
              Next Step
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
