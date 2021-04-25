import { useState, useCallback, useEffect } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import callApi from "./../callApi/callApi";
import {
  TextField,
  FormLayout,
  Button,
  InlineError,
  Card,
  Layout,
  DisplayText,
} from "@shopify/polaris";
const Form = (props) => {
  const [valueName, setName] = useState("");
  const [valueAdd, setAdd] = useState("");
  const [valueEmail, setEmail] = useState("");
  const [valuePhone, setPhone] = useState("");

  const [nameValid, setNameValid] = useState(false);
  const [addValid, setAddValid] = useState(false);
  const [emailValid, setEmailValid] = useState(false);
  const [phoneValid, setPhoneValid] = useState(false);

  const [errorNameEmpty, setErrorNameEmpty] = useState(false);
  const [errorPhoneEmpty, setErrorPhoneEmpty] = useState(false);
  const [errorAddEmpty, setErrorAddEmpty] = useState(false);
  const [errorEmailEmpty, setErrorEmailEmpty] = useState(false);

  const [errorNameType, setErrorNameType] = useState(false);
  const [errorPhoneType, setErrorPhoneType] = useState(false);
  const [errorAddType, setErrorAddType] = useState(false);
  const [errorEmailType, setErrorEmailType] = useState(false);

  const [reacapcha, setRecapcha] = useState(false);

  const [getUser, setGetUser] = useState("");

  const id = props.match.params.id;
  console.log(props.match);
  //change input fullname
  const onChangeName = useCallback(
    (value) => {
      setName(value);
      console.log(valueName);
      if (value === "" || value == null) {
        setErrorNameEmpty(true);
        setErrorNameType(false);
        setNameValid(false);
      } else if (value.length < 5) {
        setErrorNameType(true);
        setErrorNameEmpty(false);
        setNameValid(false);
      } else {
        console.log(value);
        setNameValid(true);
        setErrorNameEmpty(false);
        setErrorNameType(false);
      }
    },
    [valueName]
  );

  //change input Address
  const onChangeAdd = useCallback((value) => {
    setAdd(value);
    if (value === "" || value == null) {
      setErrorAddEmpty(true);
      setErrorAddType(false);
      setAddValid(false);
    } else if (value.length < 5) {
      setErrorAddType(true);
      setErrorAddEmpty(false);
      setAddValid(false);
    } else {
      setErrorAddEmpty(false);
      setErrorAddType(false);
      setAddValid(true);
    }
  }, []);

  //change input phone
  const onChangePhone = useCallback((value) => {
    setPhone(value);
    const regex = /(84|0[2|3|5|7|8|9])+([0-9]{8})\b/g;
    setPhone(value);
    if (value === "" || value === null) {
      setErrorPhoneEmpty(true);
      setErrorPhoneType(false);
      setPhoneValid(false);
    } else if (!regex.test(value)) {
      setErrorPhoneEmpty(false);
      setErrorPhoneType(true);
      setPhoneValid(false);
      console.log("FailType");
    } else {
      setErrorPhoneEmpty(false);
      setErrorPhoneType(false);
      setPhoneValid(true);
    }
  }, []);

  //change input email
  const onChangeEmail = useCallback((value) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    setEmail(value);
    if (value === "") {
      setErrorEmailEmpty(true);
      setEmailValid(false);
      setErrorEmailType(false);
      console.log("null");
    } else if (!re.test(value)) {
      setErrorEmailEmpty(false);
      setErrorEmailType(true);
      setEmailValid(false);
      console.log("FailType");
    } else {
      setErrorEmailEmpty(false);
      setErrorEmailType(false);
      setEmailValid(true);
      console.log("oke");
    }
  }, []);
  //Process POST data
  const fetchUser = useCallback(async () => {
    let response = await fetch(
      `https://606efb3f0c054f0017658138.mockapi.io/api/listUsers/${id}`
    );
    response = await response.json();
    setGetUser(response);
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchUser();
      setName(getUser.fullname);
      setAdd(getUser.address);
      setPhone(getUser.phone);
      setEmail(getUser.email);
    }
  }, [
    id,
    fetchUser,
    getUser.fullname,
    getUser.address,
    getUser.phone,
    getUser.email,
  ]);
  const onSaveNewUser = async () => {
    if (id) {
      console.log(id);
      await callApi(
        `listUsers/${id}`,
        "PUT",
        {
          fullname: valueName,
          phone: valuePhone,
          email: valueEmail,
          address: valueAdd,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      ).catch((error) => {
        console.log("axios error:", error);
      });
      alert("Edit Account Successfully!");
      props.history.push("/userList");
    } else {
      await callApi(
        `listUsers`,
        "POST",
        {
          fullname: valueName,
          phone: valuePhone,
          email: valueEmail,
          address: valueAdd,
          isChecked: "false",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      ).catch((error) => {
        console.log("axios error:", error);
      });
      setRecapcha(false);
      alert("Create Account Successfully!");
      props.history.push("/userList");
    }
  };

  //show reCAPCHA
  const handleSubmit = (e) => {
    e.preventDefault();
    if (id) {
      onSaveNewUser();
    } else {
      setRecapcha(true);
    }
  };
  //Save Data
  const onRecapcha = () => {
    onSaveNewUser();
  };
//Button Back
const goBack=()=>{
  props.history.goBack();
}
  return (
    <div className="form">
      <br />
      <Layout>
        <Layout.Section>
          <DisplayText className="create_user" value={valueName} size="medium">
            Create Users
          </DisplayText>
          <br></br>
          <Card sectioned>
            <FormLayout>
              <TextField
                label="Full Name(*)"
                onChange={(e) => onChangeName(e)}
                value={valueName}
                placeholder="Enter your full name"
              />
              {errorNameEmpty && (
                <InlineError message="Input fullname not Empty!" />
              )}
              {errorNameType && (
                <InlineError message="Input fullname isvalid!" />
              )}
              <TextField
                value={valuePhone}
                label="Phone Nummber(*)"
                onChange={(e) => onChangePhone(e)}
                placeholder="Enter your phone"
              />
              {errorPhoneEmpty && (
                <InlineError message="Input phone not Empty!" />
              )}
              {errorPhoneType && <InlineError message="Input isvalid!" />}
              <TextField
                label="Email(*)"
                onChange={(e) => onChangeEmail(e)}
                value={valueEmail}
                placeholder="Enter your email"
              />
              {errorEmailEmpty && (
                <InlineError message="Input email not Empty!" />
              )}
              {errorEmailType && <InlineError message="Input mail isvalid!" />}
              <TextField
                label="Address(*)"
                onChange={(e) => onChangeAdd(e)}
                value={valueAdd}
                placeholder="Enter your Address"
              />
              <></>
              {errorAddEmpty && (
                <InlineError message="Input address not Empty!" />
              )}
              {errorAddType && <InlineError message="Input address isvalid!" />}
              {addValid && emailValid && phoneValid && nameValid && !id &&(
                <Button onClick={handleSubmit} primary>
                  Submit
                </Button>
              )}
              {id && (
                <div className="button_edit">
                  <Button onClick={handleSubmit} destructive>
                    Save
                  </Button>
                  <Button onClick={goBack} primary>
                   Back
                  </Button>
                </div>
              )}
              {reacapcha && (
                <ReCAPTCHA
                  // sitekey="6LftMKEaAAAAAMFVIG7Qcma2394rdYh5srsZlnXd"
                  sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                  onChange={onRecapcha}
                />
              )}
            </FormLayout>
          </Card>
        </Layout.Section>
      </Layout>
    </div>
  );
};
export default Form;
