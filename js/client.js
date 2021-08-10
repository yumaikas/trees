export function saveOutline(documentId, outline) {
    fetch(`//outlines/${documentId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(outline),
    });
}
