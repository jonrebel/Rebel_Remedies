import { useState } from "react";
import { createTicket } from "../api/tickets";

export default function CreateTicke({ onCreated }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("MEDIUM");
    const [status, setStatus] = useState("OPEN");

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);

        if (!title.trim()) {
            setError("Title is required.");
            return;
        }

        setSaving(true);
        try {
            const newTicket = await createTicket({
                title,
                description,
                priority,
                status,
            });

            setTitle("");
            setDescription("");
            setPriority("MEDIUM");
            setStatus("OPEN");

            if (onCreated) onCreated(newTicket);
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="card card-pad">
            <div className="split">
                <h3 style={{ margin: 0 }}>Create Ticket</h3>
                {error && <span style={{ color: "crimson" }}>{error}</span>}
            </div>

            <div className="spacer" />

            <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="field" style={{ flex: 1, minWidth: 260 }}>
                        <div className="label">Title</div>
                        <input
                            className="input"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            disabled={saving}
                            placeholder="Short summary"
                        />
                    </div>

                    <div className="field">
                        <div className="label">Priority</div>
                        <select value={priority} onChange={(e) => setPriority(e.target.value)} disabled={saving}>
                            <option value="LOW">Low</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="HIGH">High</option>
                            <option value="URGENT">Urgent</option>
                        </select>
                    </div>

                    <div className="field">
                        <div className="label">Status</div>
                        <select value={status} onChange={(e) => setStatus(e.target.value)} disabled={saving}>
                            <option value="OPEN">Open</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="RESOLVED">Resolved</option>
                            <option value="CLOSED">Closed</option>
                        </select>
                    </div>

                    <button className="btn" type="submit" disabled={saving} style={{ height: 42 }}>
                        {saving ? "Saving..." : "Create"}
                    </button>
                </div>

                <div className="spacer" />

                <div className="field">
                    <div className="label">Description</div>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        disabled={saving}
                        rows={3}
                        style={{ width: "100%" }}
                        placeholder="Details (optional)"
                    />
                </div>
            </form>
        </div>
    );

}
