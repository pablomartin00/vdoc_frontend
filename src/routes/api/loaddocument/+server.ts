import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

// Usa import.meta.env para acceder a la variable de entorno
const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const POST: RequestHandler = async ({ request }) => {
    try {
        // Desestructuramos `legajo` del cuerpo de la solicitud
        const { legajo } = await request.json();

        // Realiza la solicitud al backend para cargar el documento del legajo
        const response = await fetch(`${backendUrl}/api/loaddocument`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ legajo }) // Usamos solo el legajo para esta solicitud
        });

        if (!response.ok) {
            const errorText = await response.text(); // Captura el mensaje de error del backend
            throw new Error(`Error en la solicitud: ${errorText}`);
        }

        const data = await response.json();
        return json(data); // Enviar la respuesta del backend al cliente
    } catch (error) {
        console.error('Error en la solicitud al backend:', error);
        return json({
            error: error.message,
            backendUrl: backendUrl,
            status: 500
        }, { status: 500 }); // Enviar mensaje de error y URL del backend al cliente
    }
};
