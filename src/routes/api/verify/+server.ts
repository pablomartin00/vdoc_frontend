import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

const backendUrl = import.meta.env.VITE_BACKEND_URL; // Acceder a la variable de entorno

export const POST: RequestHandler = async ({ request }) => {
    try {
        // Extraemos `legajo` en lugar de `birthChartReport`
        const { user, question, token, history, legajo } = await request.json();

        // Realiza la solicitud al backend desde el servidor
        const response = await fetch(`${backendUrl}/api/verify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user,
                question,
                token,
                history, 
                legajo // Incluimos el legajo médico en lugar del reporte de carta astral
            })
        });

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.statusText}`);
        }

        const data = await response.json();

        return json(data); // Devolver la respuesta del backend
    } catch (error) {
        console.error('Error en la solicitud al backend:', error);
        return json({ error: 'Error en la solicitud al backend' }, { status: 500 });
    }
};
