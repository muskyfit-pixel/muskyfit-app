export default function MemberDatabase() {
  return (
    <div
      style={{
        padding: 16,
        maxWidth: 960,
        margin: '0 auto',
        boxSizing: 'border-box',
      }}
    >
      <h1 style={{ marginBottom: 16 }}>Members</h1>

      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          border: '1px solid #ddd',
        }}
      >
        <thead>
          <tr style={{ background: '#f5f5f5' }}>
            <th style={th}>Name</th>
            <th style={th}>Status</th>
            <th style={th}>Programme</th>
            <th style={th}>Last Check-in</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={td}>—</td>
            <td style={td}>—</td>
            <td style={td}>—</td>
            <td style={td}>—</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

const th: React.CSSProperties = {
  textAlign: 'left',
  padding: 12,
  borderBottom: '1px solid #ddd',
  fontWeight: 600,
}

const td: React.CSSProperties = {
  padding: 12,
  borderBottom: '1px solid #eee',
}
