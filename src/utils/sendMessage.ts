export async function sendMessageToServer(userName: string, userMessage: string, messages: Array<{role: string, content: string}>, selectedPatient: string) {
    try {
        const response = await fetch('/api/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user: userName,
                question: userMessage,
                history: messages,
                legajo: selectedPatient
            })
        });
        const responseData = await response.json();
        return [...messages, { role: 'assistant', content: responseData.message }];
    } catch (error) {
        console.error("Error sending message:", error);
        return [...messages, { role: 'assistant', content: 'Error procesando el mensaje.' }];
    }
}
