import { apiFetch } from "./apiClient.js";

export async function getTickets(params = {}) {
    const qs = new URLSearchParams(params);

    for (const [k, v] of qs.entries()) {
        if (v === "" || v == null) qs.delete(k);
    }

    const url = qs.toString() ? `/api/tickets/?${qs.toString()}` : "/api/tickets/";
    const response = await apiFetch(url);

    if (!response.ok) throw new Error("Failed to fetch tickets");
    return response.json();
}


export async function getTicketById(id) {
    const response = await apiFetch(`/api/tickets/${id}/`);
    if (!response.ok) {
        throw new Error("Failed to fetch ticket");
    }
    return response.json();
}

export async function createTicket(tdata) {
    const response = await apiFetch("/api/tickets/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tdata),
    });

    if (!response.ok) {
        let details = "Failed to create ticket";
        try {
            const data = await response.json();
            details = JSON.stringify(data);
        } catch { }
        throw new Error(details);
    }

    return response.json();
}

export async function updateTicket(id, tdata) {
    const response = await apiFetch(`/api/tickets/${id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tdata),
    });

    if (!response.ok) {
        let details = "Failed to update ticket";
        try {
            const data = await response.json();
            details = JSON.stringify(data);
        } catch { }
        throw new Error(details);
    }

    return response.json();
}

export async function deleteTicket(id) {
    const response = await apiFetch(`/api/tickets/${id}/`, {
        method: "DELETE",
    });

    if (!response.ok) {
        let details = "Failed to delete ticket";
        try {
            const data = await response.json();
            details = JSON.stringify(data);
        } catch { }
        throw new Error(details);
    }
    return true;
}

// Functions for comments 
export async function getComments(ticketId) {
    const response = await apiFetch(`/api/tickets/${ticketId}/comments/`);
    if (!response.ok) throw new Error("Failed to fetch comments");
    return response.json();
}

export async function createComment(ticketId, payload) {
    const response = await apiFetch(`/api/tickets/${ticketId}/comments/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        let details = "Failed to create comment";
        try {
            const data = await response.json();
            details = JSON.stringify(data);
        } catch { }
        throw new Error(details);
    }

    return response.json();
}



