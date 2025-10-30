import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data from Express API
    axios.get("http://localhost:5000/api/accounts")
      .then(response => {
        setAccounts(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>🏦 Banking Accounts Dashboard</h1>

      {loading ? (
        <p>Loading data...</p>
      ) : (
        <table border="1" style={{ margin: "0 auto", padding: "10px" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Balance ($)</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map(acc => (
              <tr key={acc.id}>
                <td>{acc.id}</td>
                <td>{acc.name}</td>
                <td>{acc.balance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
