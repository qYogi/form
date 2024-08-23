import { Form } from "./Form.tsx";

interface Props {
  goToNextStep: () => void;
}

export const PersonalInfoForm = ({ goToNextStep }: Props) => {
  return (
    <>
      <Form
        onSuccessfulSubmit={(data) => {
          console.log(data);
          goToNextStep();
        }}
      />
    </>
  );
};
