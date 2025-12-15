export default function Badge({ text, dotColor = "#8ab4ff" }) {
    return (
        <span className="badge">
            <span className="badge-dot" style={{ background: dotColor }} />
            {text}
        </span>
    );
}
