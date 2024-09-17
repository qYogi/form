import React, { FormEvent, useEffect, useState } from "react";
import formStyles from "./form.module.css";
import btnStyles from "./button.module.css";
import { Auth } from "aws-amplify";
import { usePlan } from "../FormContext.tsx";

interface FormErrors {
  name: string;
  email: string;
  phone: string;
}

export const Form: React.FC<{ onSuccessfulSubmit: () => void }> = ({
  onSuccessfulSubmit,
}) => {
  const { name, email, phone, setName, setEmail, setPhone } = usePlan();

  // State to manage form errors
  const [errors, setErrors] = useState<FormErrors>({
    name: "",
    email: "",
    phone: "",
  });

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    Auth.currentAuthenticatedUser().then((user) => {
      setEmail(user.attributes.email);
      setName(user.attributes.name || "");
      setPhone(user.attributes.phone_number || "");
    });
  }, []);

  const validate = () => {
    const tempErrors: FormErrors = { name: "", email: "", phone: "" };
    if (!name) tempErrors.name = "Name is required";
    if (!email) tempErrors.email = "Email is required";
    if (!phone || !/^\+40\d{9}$/.test(phone)) {
      tempErrors.phone =
        "Phone number is required and must be in format +40XXXXXXXXX";
    }
    setErrors(tempErrors);
    return Object.values(tempErrors).every((error) => error === "");
  };

  const formatPhoneNumber = (phone: string) => {
    const numericPhone = phone.replace(/\D/g, "");
    if (numericPhone.startsWith("0")) {
      return `+40${numericPhone.slice(1)}`;
    }
    return `+${numericPhone}`;
  };

  // Handle input changes and update localStorage
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name: fieldName, value } = e.target;

    if (fieldName === "phone") {
      let formattedPhone = value.replace(/\D/g, "");
      if (!formattedPhone.startsWith("40")) {
        formattedPhone = "40" + formattedPhone;
      }
      if (formattedPhone.length > 11) {
        formattedPhone = formattedPhone.slice(0, 11);
      }
      setPhone(`+${formattedPhone}`);
    } else if (fieldName === "name") {
      setName(value);
    } else if (fieldName === "email") {
      setEmail(value);
    }
    // localStorage.setItem(
    //   "personalInfoFormValues",
    //   JSON.stringify({ name, email, phone }),
    // );
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validate()) {
      setLoading(true);
      const formattedPhoneNumber = formatPhoneNumber(phone);

      try {
        const user = await Auth.currentAuthenticatedUser();
        await Auth.updateUserAttributes(user, {
          phone_number: formattedPhoneNumber,
          name: name,
        });
        onSuccessfulSubmit();
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    } else {
      console.error("Validation errors:", errors);
    }
  };

  return (
    <div className={formStyles.container}>
      <div className={formStyles.header}>
        <h1>Personal Info</h1>
        <p>Please provide your name, email address, and phone number</p>
      </div>
      <form onSubmit={handleSubmit} className={formStyles.form}>
        <div className={formStyles.formInputs}>
          <div className={formStyles.name}>
            <label>Name</label>
            <input
              type="text"
              name="name"
              placeholder="e.g. Stephan The Great"
              value={name}
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
              value={email}
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
              value={phone}
              onChange={handleChange}
              className={formStyles.input}
            />
            {errors.phone && (
              <span className={formStyles.error}>{errors.phone}</span>
            )}
          </div>
        </div>

        <div className={btnStyles.buttonCnt}>
          <button className={btnStyles.button} type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Next Step"} {/* Change button text */}
          </button>
        </div>
      </form>
    </div>
  );
};
