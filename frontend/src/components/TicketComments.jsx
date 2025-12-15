import { useEffect, useState } from "react";
import { createComment, getComments } from "../api/tickets";

export default function TicketComments({ ticketId }) {
    const [comments, setComments] = useState([]);
    const [body, setBody] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    async function load() {
        setError(null);
        setLoading(true);
        try {
            const data = await getComments(ticketId);
            const list = Array.isArray(data) ? data : (data.results ?? []);
            setComments(list);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, [ticketId]);

    async function handleSubmit(e) {
        e.preventDefault();
        if (!body.trim()) return;

        setSaving(true);
        try {
            await createComment(ticketId, { body });
            setBody("");
            await load();
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    }

    return (
        <div style={{ marginTop: "1rem" }}>
            <h3>Comments</h3>

            {error && <p style={{ color: "crimson" }}>Error: {error}</p>}
            {loading ? (
                <p>Loading comments...</p>
            ) : comments.length === 0 ? (
                <p>No comments yet.</p>
            ) : (
                <ul>
                    {comments.map((c) => (
                        <li key={c.id} style={{ marginBottom: ".5rem" }}>
                            <div>{c.body}</div>
                            <small>{c.created_at}</small>
                        </li>
                    ))}
                </ul>
            )}

            <form onSubmit={handleSubmit} style={{ marginTop: "1rem" }}>
                <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    rows={3}
                    style={{ width: "320px" }}
                    placeholder="Add an update..."
                    disabled={saving}
                />
                <br />
                <button type="submit" disabled={saving}>
                    {saving ? "Adding..." : "Add Comment"}
                </button>
            </form>
        </div>
    );
}
