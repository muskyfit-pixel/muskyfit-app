import BaseLayout from "../components/BaseLayout"

export default function Onboarding() {
  return (
    <BaseLayout title="Health Questionnaire">
      <p>Please answer the questions below honestly.</p>

      <p>
        Once submitted, I will review your answers and confirm whether
        you can move forward.
      </p>

      <button style={btn}>Submit PAR-Q</button>
    </BaseLayout>
  )
}

const btn = {
  marginTop: "20px",
  padding: "14px",
  width: "100%",
  fontSize: "16px",
}
