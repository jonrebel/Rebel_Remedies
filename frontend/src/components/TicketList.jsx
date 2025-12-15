import { useEffect, useState } from "react";
import { getTickets } from "../api/tickets";
import CreateTicket from "./CreateTicket";
import { Link } from "react-router-dom";
import Badge from "./Badge";


export default function TicketsList() {
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [next, setNext] = useState(null);
  const [previous, setPrevious] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [search, setSearch] = useState("");


  async function loadTickets() {
    setError(null);
    setLoading(true);
    try {
      const data = await getTickets({
        status: statusFilter,
        priority: priorityFilter,
        search: search,
        page: page,
      });
      setTickets(data.results);
      setCount(data.count);
      setNext(data.next);
      setPrevious(data.previous);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTickets();
  }, [page]);

  if (loading) return <p>Loading tickets...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <div className="card card-pad">
        <div className="row">
          <div className="field">
            <div className="label">Status</div>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">All</option>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>

          <div className="field">
            <div className="label">Priority</div>
            <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
              <option value="">All</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>

          <div className="field" style={{ minWidth: 260 }}>
            <div className="label">Search</div>
            <input
              className="input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="title or description"
            />
          </div>

          <button
            className="btn"
            onClick={() => {
              setPage(1);
              loadTickets();
            }}
          >
            Search
          </button>
        </div>
      </div>

      <CreateTicket onCreated={() => loadTickets()} />
      <h2>Helpdesk Tickets</h2>
      <div style={{ marginTop: "1rem" }}>
        <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={!previous} style={{ marginRight: ".5rem" }}>
          Previous
        </button>
        <button onClick={() => setPage((p) => p + 1)} disabled={!next}>
          Next
        </button>
        <span style={{ marginLeft: "1rem" }}>
          Page {page} — Total: {count}
        </span>
      </div>
      <div className="card card-pad">
        <div className="split">
          <h2 style={{ margin: 0 }}>Ticket Queue</h2>
          <div className="muted">Total: {count}</div>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Status</th>
              <th>Priority</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((t) => (
              <tr key={t.id} className="tr-hover">
                <td className="muted">#{t.id}</td>
                <td>
                  <Link to={`/tickets/${t.id}`}><strong>{t.title}</strong></Link>
                </td>
                <td>
                  <Badge
                    text={t.status}
                    dotColor={
                      t.status === "OPEN" ? "#8ab4ff" :
                        t.status === "IN_PROGRESS" ? "#ffd37a" :
                          t.status === "RESOLVED" ? "#7dffb2" :
                            "#b0b7c6"
                    }
                  />
                </td>
                <td>
                  <Badge
                    text={t.priority}
                    dotColor={
                      t.priority === "LOW" ? "#b0b7c6" :
                        t.priority === "MEDIUM" ? "#8ab4ff" :
                          t.priority === "HIGH" ? "#ffd37a" :
                            "#ff7d7d"
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
