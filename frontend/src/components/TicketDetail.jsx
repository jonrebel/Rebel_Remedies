import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getTicketById, updateTicket, deleteTicket } from "../api/tickets";
import TicketComments from "./TicketComments";


export default function TicketDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState(null);
    const [updating, setUpdating] = useState(false);
    const [updateError, setUpdateError] = useState(null);
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setError(null);
        setLoading(true);

        getTicketById(id)
            .then((data) => {
                setTicket(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, [id]);

    async function handleDelete() {
        setDeleteError(null);

        const ok = window.confirm("Delete this ticket? This cannot be undone.");
        if (!ok) return;

        setDeleting(true);
        try {
            await deleteTicket(id);
            navigate("/tickets");
        } catch (err) {
            setDeleteError(err.message);
        } finally {
            setDeleting(false);
        }
    }


    async function changeStatus(newStatus) {
        setUpdateError(null);
        setUpdating(true);

        try {
            const updated = await updateTicket(id, { status: newStatus });
            setTicket(updated);
        } catch (err) {
            setUpdateError(err.message);
        } finally {
            setUpdating(false);
        }
    }


    if (loading) return <p>Loading ticket...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!ticket) return <p>Ticket not found.</p>;



    return (
        <div className="grid-2">
            <div className="card card-pad">
                <div className="split">
                    <div>
                        <div className="muted">Ticket #{ticket.id}</div>
                        <h2 style={{ margin: "6px 0 0 0" }}>{ticket.title}</h2>
                    </div>

                    <div style={{ display: "flex", gap: 10 }}>
                        <Link className="btn" to={`/tickets/${ticket.id}/edit`}>Edit</Link>
                        <button className="btn" onClick={handleDelete} disabled={deleting}>
                            {deleting ? "Deleting..." : "Delete"}
                        </button>
                    </div>
                </div>

                {deleteError && <p style={{ color: "crimson" }}>Delete failed: {deleteError}</p>}

                <div className="hr" />

                <div className="section-title">Description</div>
                <div className="v">{ticket.description || <span className="muted">(No description)</span>}</div>

                <div className="hr" />

                <TicketComments ticketId={ticket.id} />
            </div>

            <div className="card card-pad">
                <div className="section-title">Details</div>

                <div className="kv">
                    <div className="k">Status</div>
                    <div className="v">{ticket.status}</div>

                    <div className="k">Priority</div>
                    <div className="v">{ticket.priority}</div>

                    <div className="k">Created</div>
                    <div className="v">{ticket.created_at}</div>

                    <div className="k">Updated</div>
                    <div className="v">{ticket.updated_at}</div>
                </div>

                <div className="hr" />

                <div className="section-title">Quick Status</div>

                {updateError && <p style={{ color: "crimson" }}>Update failed: {updateError}</p>}

                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button className="btn" onClick={() => changeStatus("OPEN")} disabled={updating || ticket.status === "OPEN"}>
                        Open
                    </button>
                    <button className="btn" onClick={() => changeStatus("IN_PROGRESS")} disabled={updating || ticket.status === "IN_PROGRESS"}>
                        In Progress
                    </button>
                    <button className="btn" onClick={() => changeStatus("RESOLVED")} disabled={updating || ticket.status === "RESOLVED"}>
                        Resolved
                    </button>
                    <button className="btn" onClick={() => changeStatus("CLOSED")} disabled={updating || ticket.status === "CLOSED"}>
                        Closed
                    </button>
                </div>

                {updating && <p className="muted" style={{ marginTop: 10 }}>Updating…</p>}

                <div className="hr" />

                <Link to="/tickets" className="muted">← Back to queue</Link>
            </div>
        </div>
    );
}
