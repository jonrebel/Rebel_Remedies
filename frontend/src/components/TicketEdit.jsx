import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getTicketById, updateTicket } from "../api/tickets";

export default function TicketEditForm() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("MEDIUM");
    const [status, setStatus] = useState("OPEN");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        setError(null);
        setLoading(true);

        getTicketById(id)
            .then((t) => {
                setTitle(t.title ?? "");
                setDescription(t.description ?? "");
                setPriority(t.priority ?? "MEDIUM");
                setStatus(t.status ?? "OPEN");
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, [id]);

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);

        if (!title.trim()) {
            setError("Title is required.");
            return;
        }

        setSaving(true);
        try {
            await updateTicket(id, { title, description, priority, status });
            navigate(`/tickets/${id}`);
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    }

    if (loading) return <p>Loading ticket for edit...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <p>
                <Link to={`/tickets/${id}`}>← Back to ticket</Link>
            </p>

            <h2>Edit Ticket #{id}</h2>

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: ".5rem" }}>
                    <label>
                        Title<br />
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            disabled={saving}
                            style={{ width: "320px" }}
                        />
                    </label>
                </div>

                <div style={{ marginBottom: ".5rem" }}>
                    <label>
                        Description<br />
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            disabled={saving}
                            rows={4}
                            style={{ width: "320px" }}
                        />
                    </label>
                </div>

                <div style={{ marginBottom: ".5rem" }}>
                    <label>
                        Priority<br />
                        <select
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                            disabled={saving}
                        >
                            <option value="LOW">Low</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="HIGH">High</option>
                            <option value="URGENT">Urgent</option>
                        </select>
                    </label>
                </div>

                <div style={{ marginBottom: ".5rem" }}>
                    <label>
                        Status<br />
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            disabled={saving}
                        >
                            <option value="OPEN">Open</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="RESOLVED">Resolved</option>
                            <option value="CLOSED">Closed</option>
                        </select>
                    </label>
                </div>

                <button type="submit" disabled={saving}>
                    {saving ? "Saving..." : "Save Changes"}
                </button>
            </form>
        </div>
    );
}
