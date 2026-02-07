import { ReactNode } from "react"
import { useNavigate } from "react-router-dom"

type Props = {
  title: string
  showBack?: boolean
  children: ReactNode
}

export default function BaseLayout({ title, showBack = false, children }: Props) {
  const navigate = useNavigate()

  return (
    <div style={styles.wrapper}>
      <header style={styles.header}>
        {showBack && (
          <button style={styles.backBtn} onClick={() => navigate(-1)}>
            ← Back
          </button>
        )}
        <h1 style={styles.title}>{title}</h1>
      </header>

      <main style={styles.content}>{children}</main>
    </div>
  )
}

const styles: any = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "#ffffff",
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont",
  },
  header: {
    padding: "16px",
    borderBottom: "1px solid #e5e5e5",
  },
  title: {
    margin: 0,
    fontSize: "22px",
  },
  backBtn: {
    marginBottom: "8px",
    background: "none",
    border: "none",
    fontSize: "16px",
    cursor: "pointer",
  },
  content: {
    flex: 1,
    padding: "16px",
  },
}
